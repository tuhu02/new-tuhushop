<?php

namespace App\Services;

use App\Models\PaymentChannel;
use App\Models\PaymentMethod;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class TripayService
{
    private string $apiKey;
    private string $privateKey;
    private string $merchantCode;
    private string $baseUrl;

    public function __construct()
    {
        $this->apiKey        = config('tripay.api_key');
        $this->privateKey    = config('tripay.private_key');
        $this->merchantCode  = config('tripay.merchant_code');
        $this->baseUrl       = config('tripay.sandbox')
            ? 'https://tripay.co.id/api-sandbox'
            : 'https://tripay.co.id/api';
    }

    // Buat transaksi baru
    public function createTransaction(array $data): array
    {
        $signature = hash_hmac(
            'sha256',
            $this->merchantCode . $data['merchant_ref'] . $data['amount'],
            $this->privateKey
        );

        $response = Http::withToken($this->apiKey)
            ->post("{$this->baseUrl}/transaction/create", [
                'method'         => $data['method'],       // contoh: 'BRIVA'
                'merchant_ref'   => $data['merchant_ref'], // ID order kamu
                'amount'         => $data['amount'],
                'customer_name'  => $data['customer_name'],
                'customer_email' => $data['customer_email'],
                'customer_phone' => $data['customer_phone'],
                'order_items'    => $data['order_items'],
                'return_url'     => $data['return_url'],
                'expired_time'   => time() + (24 * 60 * 60),
                'signature'      => $signature,
            ]);

        return $response->json();
    }

    /**
     * Ambil daftar payment channel resmi dari Tripay.
     *
     * @return array<string, mixed>
     */
    public function getMerchantPaymentChannels(): array
    {
        $response = Http::withToken($this->apiKey)
            ->get("{$this->baseUrl}/merchant/payment-channel");

        return $response->json();
    }

    /**
     * Ambil instruksi pembayaran resmi untuk method/channel tertentu.
     *
     * @return array<string, mixed>
     */
    public function getPaymentInstructions(string $code): array
    {
        $response = Http::withToken($this->apiKey)
            ->get("{$this->baseUrl}/payment/instruction", [
                'code' => $code,
            ]);

        return $response->json();
    }

    /**
     * Sinkronkan payment methods + channels dari Tripay ke database lokal.
     *
     * @return array{created: int, updated: int, skipped: int}
     */
    public function syncPaymentChannels(): array
    {
        $payload = $this->getMerchantPaymentChannels();

        if (($payload['success'] ?? false) !== true) {
            $message = (string) ($payload['message'] ?? 'Gagal mengambil payment channel dari Tripay.');
            throw new RuntimeException($message);
        }

        $channels = $payload['data'] ?? null;

        if (! is_array($channels)) {
            throw new RuntimeException('Format data payment channel dari Tripay tidak valid.');
        }

        $result = [
            'created' => 0,
            'updated' => 0,
            'skipped' => 0,
        ];

        DB::transaction(function () use ($channels, &$result): void {
            foreach ($channels as $channelData) {
                if (! is_array($channelData)) {
                    $result['skipped']++;
                    continue;
                }

                $channelCode = strtoupper(trim((string) ($channelData['code'] ?? '')));

                if ($channelCode === '') {
                    $result['skipped']++;
                    continue;
                }

                $groupName = trim((string) ($channelData['group'] ?? 'Lainnya'));
                $methodCode = $this->resolveMethodCode($groupName);
                $methodName = $groupName !== '' ? $groupName : 'Lainnya';

                $methodLogoPath = $this->storeLogoFromUrl(
                    directory: 'payment-methods',
                    fileBaseName: $methodCode,
                    imageUrl: $channelData['icon_url'] ?? null,
                    fallbackLabel: $methodName,
                );

                $method = PaymentMethod::query()->firstOrNew(['code' => $methodCode]);
                $method->name = $methodName;
                $method->logo = $methodLogoPath;
                $method->is_active = true;
                $method->save();

                $feeFlat = (int) data_get($channelData, 'fee_merchant.flat', 0);
                $feePercent = (float) data_get($channelData, 'fee_merchant.percent', 0);
                $minAmount = data_get($channelData, 'minimum_fee');
                $maxAmount = data_get($channelData, 'maximum_fee');

                $channelLogoPath = $this->storeLogoFromUrl(
                    directory: 'payment-channels',
                    fileBaseName: Str::slug(strtolower($channelCode)),
                    imageUrl: $channelData['icon_url'] ?? null,
                    fallbackLabel: (string) ($channelData['name'] ?? $channelCode),
                );

                $paymentChannel = PaymentChannel::query()
                    ->whereRaw('UPPER(code) = ?', [$channelCode])
                    ->first();

                if ($paymentChannel === null) {
                    $paymentChannel = new PaymentChannel();
                    $result['created']++;
                } else {
                    $result['updated']++;
                }

                $paymentChannel->payment_method_id = $method->id;
                $paymentChannel->name = (string) ($channelData['name'] ?? $channelCode);
                $paymentChannel->code = $channelCode;
                $paymentChannel->logo = $channelLogoPath;
                $paymentChannel->fee = $feeFlat;
                $paymentChannel->fee_percent = $feePercent;
                $paymentChannel->min_amount = is_numeric($minAmount) ? (int) $minAmount : null;
                $paymentChannel->max_amount = is_numeric($maxAmount) ? (int) $maxAmount : null;
                $paymentChannel->instructions = $this->fetchNormalizedInstructions($channelCode);
                $paymentChannel->is_active = (bool) ($channelData['active'] ?? true);
                $paymentChannel->save();
            }
        });

        return $result;
    }

    // Cek detail transaksi
    public function getTransaction(string $reference): array
    {
        $response = Http::withToken($this->apiKey)
            ->get("{$this->baseUrl}/transaction/detail", [
                'reference' => $reference
            ]);

        return $response->json();
    }

    // Verifikasi callback dari Tripay
    public function verifyCallback(string $signature): bool
    {
        $json = file_get_contents('php://input');
        $expected = hash_hmac('sha256', $json, $this->privateKey);
        return hash_equals($expected, $signature);
    }

    private function resolveMethodCode(string $groupName): string
    {
        $normalized = strtoupper(trim($groupName));

        return match ($normalized) {
            'E-WALLET', 'QRIS' => 'ewallet-qris',
            'VIRTUAL ACCOUNT' => 'virtual-account',
            default => Str::slug($groupName !== '' ? $groupName : 'Lainnya'),
        };
    }

    /**
     * @return array<int, array{title: string, steps: array<int, string>}>
     */
    private function fetchNormalizedInstructions(string $channelCode): array
    {
        $payload = $this->getPaymentInstructions($channelCode);

        if (($payload['success'] ?? false) !== true) {
            return [];
        }

        $rawData = $payload['data'] ?? [];

        if (! is_array($rawData)) {
            return [];
        }

        $normalized = [];

        foreach ($rawData as $item) {
            if (! is_array($item)) {
                continue;
            }

            $title = trim((string) ($item['title'] ?? 'Instruksi Pembayaran'));
            $rawSteps = $item['steps'] ?? [];

            $steps = collect(is_array($rawSteps) ? $rawSteps : [])
                ->map(fn($step): string => trim((string) $step))
                ->filter(fn(string $step): bool => $step !== '')
                ->values()
                ->all();

            if ($title === '' || $steps === []) {
                continue;
            }

            $normalized[] = [
                'title' => $title,
                'steps' => $steps,
            ];
        }

        return $normalized;
    }

    private function storeLogoFromUrl(
        string $directory,
        string $fileBaseName,
        mixed $imageUrl,
        string $fallbackLabel,
    ): string {
        $disk = Storage::disk('public');
        $basePath = trim($directory, '/');
        $safeName = Str::slug($fileBaseName !== '' ? $fileBaseName : 'logo');

        if (is_string($imageUrl) && filter_var($imageUrl, FILTER_VALIDATE_URL)) {
            $response = Http::timeout(15)->get($imageUrl);

            if ($response->successful() && $response->body() !== '') {
                $extension = strtolower(pathinfo((string) parse_url($imageUrl, PHP_URL_PATH), PATHINFO_EXTENSION));
                $allowedExtensions = ['svg', 'png', 'jpg', 'jpeg', 'webp'];

                if (! in_array($extension, $allowedExtensions, true)) {
                    $extension = 'png';
                }

                $path = "{$basePath}/{$safeName}.{$extension}";
                $disk->put($path, $response->body());

                return $path;
            }
        }

        $path = "{$basePath}/{$safeName}.svg";

        if (! $disk->exists($path)) {
            $disk->put($path, $this->buildFallbackLogoSvg($fallbackLabel));
        }

        return $path;
    }

    private function buildFallbackLogoSvg(string $label): string
    {
        $safeLabel = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $label) ?? 'PM', 0, 4));

        if ($safeLabel === '') {
            $safeLabel = 'PM';
        }

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="80" viewBox="0 0 160 80" fill="none">
  <rect width="160" height="80" rx="16" fill="#111827" />
  <text x="80" y="50" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#ffffff">{$safeLabel}</text>
</svg>
SVG;
    }
}
