<?php

namespace Database\Seeders;

use App\Models\PaymentChannel;
use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class PaymentSeeder extends Seeder
{
    /**
     * Seed payment methods and channels for checkout.
     */
    public function run(): void
    {
        $methods = [
            [
                'name' => 'E-Wallet dan QRIS',
                'code' => 'ewallet-qris',
                'logo' => [
                    'path' => 'payment-methods/ewallet-qris.svg',
                    'label' => 'EW',
                    'bg' => '#111827',
                    'fg' => '#ffffff',
                ],
                'channels' => [
                    [
                        'name' => 'QRIS',
                        'code' => 'qris',
                        'fee' => 1500,
                        'fee_percent' => 0.8,
                        'min_amount' => 1000,
                        'max_amount' => null,
                        'is_active' => true,
                        'logo' => [
                            'path' => 'payment-channels/qris.svg',
                            'label' => 'QR',
                            'bg' => '#111827',
                            'fg' => '#ffffff',
                        ],
                    ],
                    [
                        'name' => 'DANA',
                        'code' => 'dana',
                        'fee' => 1500,
                        'fee_percent' => 0.8,
                        'min_amount' => 1000,
                        'max_amount' => null,
                        'is_active' => true,
                        'logo' => [
                            'path' => 'payment-channels/dana.svg',
                            'label' => 'DN',
                            'bg' => '#1d9bf0',
                            'fg' => '#ffffff',
                        ],
                    ],
                    [
                        'name' => 'GoPay',
                        'code' => 'gopay',
                        'fee' => 1500,
                        'fee_percent' => 0.8,
                        'min_amount' => 1000,
                        'max_amount' => null,
                        'is_active' => true,
                        'logo' => [
                            'path' => 'payment-channels/gopay.svg',
                            'label' => 'GP',
                            'bg' => '#00a9e0',
                            'fg' => '#ffffff',
                        ],
                    ],
                    [
                        'name' => 'OVO',
                        'code' => 'ovo',
                        'fee' => 1500,
                        'fee_percent' => 0.8,
                        'min_amount' => 1000,
                        'max_amount' => null,
                        'is_active' => true,
                        'logo' => [
                            'path' => 'payment-channels/ovo.svg',
                            'label' => 'OV',
                            'bg' => '#4c2882',
                            'fg' => '#ffffff',
                        ],
                    ],
                    [
                        'name' => 'LinkAja',
                        'code' => 'linkaja',
                        'fee' => 1500,
                        'fee_percent' => 0.8,
                        'min_amount' => 1000,
                        'max_amount' => null,
                        'is_active' => true,
                        'logo' => [
                            'path' => 'payment-channels/linkaja.svg',
                            'label' => 'LA',
                            'bg' => '#ef4444',
                            'fg' => '#ffffff',
                        ],
                    ],
                    [
                        'name' => 'ShopeePay',
                        'code' => 'shopeepay',
                        'fee' => 1500,
                        'fee_percent' => 0.8,
                        'min_amount' => 1000,
                        'max_amount' => null,
                        'is_active' => true,
                        'logo' => [
                            'path' => 'payment-channels/shopeepay.svg',
                            'label' => 'SP',
                            'bg' => '#f97316',
                            'fg' => '#ffffff',
                        ],
                    ],
                    [
                        'name' => 'AstraPay',
                        'code' => 'astrapay',
                        'fee' => 1500,
                        'fee_percent' => 0.8,
                        'min_amount' => 1000,
                        'max_amount' => null,
                        'is_active' => true,
                        'logo' => [
                            'path' => 'payment-channels/astrapay.svg',
                            'label' => 'AS',
                            'bg' => '#2563eb',
                            'fg' => '#ffffff',
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Virtual Account',
                'code' => 'virtual-account',
                'logo' => [
                    'path' => 'payment-methods/virtual-account.svg',
                    'label' => 'VA',
                    'bg' => '#334155',
                    'fg' => '#ffffff',
                ],
                'channels' => [
                    [
                        'name' => 'VA BCA',
                        'code' => 'va-bca',
                        'fee' => 4000,
                        'fee_percent' => 0,
                        'min_amount' => 50000,
                        'max_amount' => null,
                        'is_active' => true,
                        'logo' => [
                            'path' => 'payment-channels/va-bca.svg',
                            'label' => 'BCA',
                            'bg' => '#2563eb',
                            'fg' => '#ffffff',
                        ],
                    ],
                    [
                        'name' => 'VA Mandiri',
                        'code' => 'va-mandiri',
                        'fee' => 4000,
                        'fee_percent' => 0,
                        'min_amount' => 50000,
                        'max_amount' => null,
                        'is_active' => true,
                        'logo' => [
                            'path' => 'payment-channels/va-mandiri.svg',
                            'label' => 'MDR',
                            'bg' => '#f59e0b',
                            'fg' => '#111827',
                        ],
                    ],
                    [
                        'name' => 'VA BRI',
                        'code' => 'va-bri',
                        'fee' => 4000,
                        'fee_percent' => 0,
                        'min_amount' => 50000,
                        'max_amount' => null,
                        'is_active' => true,
                        'logo' => [
                            'path' => 'payment-channels/va-bri.svg',
                            'label' => 'BRI',
                            'bg' => '#1d4ed8',
                            'fg' => '#ffffff',
                        ],
                    ],
                    [
                        'name' => 'VA BNI',
                        'code' => 'va-bni',
                        'fee' => 4000,
                        'fee_percent' => 0,
                        'min_amount' => 50000,
                        'max_amount' => null,
                        'is_active' => true,
                        'logo' => [
                            'path' => 'payment-channels/va-bni.svg',
                            'label' => 'BNI',
                            'bg' => '#f97316',
                            'fg' => '#111827',
                        ],
                    ],
                ],
            ],
        ];

        foreach ($methods as $methodData) {
            $methodLogoPath = $this->ensureLogo(
                $methodData['logo']['path'],
                $methodData['logo']['label'],
                $methodData['logo']['bg'],
                $methodData['logo']['fg'],
            );

            $method = PaymentMethod::query()->updateOrCreate(
                ['code' => $methodData['code']],
                [
                    'name' => $methodData['name'],
                    'logo' => $methodLogoPath,
                    'is_active' => true,
                ],
            );

            foreach ($methodData['channels'] as $channelData) {
                $channelLogoPath = $this->ensureLogo(
                    $channelData['logo']['path'],
                    $channelData['logo']['label'],
                    $channelData['logo']['bg'],
                    $channelData['logo']['fg'],
                );

                PaymentChannel::query()->updateOrCreate(
                    ['code' => $channelData['code']],
                    [
                        'payment_method_id' => $method->id,
                        'name' => $channelData['name'],
                        'logo' => $channelLogoPath,
                        'fee' => $channelData['fee'],
                        'fee_percent' => $channelData['fee_percent'],
                        'min_amount' => $channelData['min_amount'],
                        'max_amount' => $channelData['max_amount'],
                        'is_active' => $channelData['is_active'],
                    ],
                );
            }
        }
    }

    private function ensureLogo(
        string $path,
        string $label,
        string $backgroundColor,
        string $textColor,
    ): string {
        $disk = Storage::disk('public');

        if (! $disk->exists($path)) {
            $svg = $this->buildLogoSvg($label, $backgroundColor, $textColor);
            $disk->put($path, $svg);
        }

        return $path;
    }

    private function buildLogoSvg(
        string $label,
        string $backgroundColor,
        string $textColor,
    ): string {
        $safeLabel = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $label) ?? 'PM', 0, 4));

        if ($safeLabel === '') {
            $safeLabel = 'PM';
        }

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="80" viewBox="0 0 160 80" fill="none">
  <rect width="160" height="80" rx="16" fill="{$backgroundColor}" />
  <text x="80" y="50" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="{$textColor}">{$safeLabel}</text>
</svg>
SVG;
    }
}
