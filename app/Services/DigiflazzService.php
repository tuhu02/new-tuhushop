<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DigiflazzService
{
    protected string $username;
    protected string $apiKey;
    protected string $baseUrl;

    public function __construct()
    {
        $this->username = config('services.digiflazz.username');
        $this->apiKey = config('services.digiflazz.api_key');
        $this->baseUrl = config('services.digiflazz.base_url', 'https://api.digiflazz.com/v1');
    }

    /**
     * Membuat transaksi pembelian ke Digiflazz.
     */
    public function createTransaction(array $data): array
    {
        $refId = $data['ref_id'];

        $payload = [
            'username' => $this->username,
            'buyer_sku_code' => $data['buyer_sku_code'],
            'customer_no' => $data['customer_no'],
            'ref_id' => $refId,
            'sign' => $this->makeTransactionSignature($refId),
        ];

        Log::info('Digiflazz request', [
            'payload' => $payload,
        ]);

        $response = Http::timeout(30)
            ->post($this->baseUrl . '/transaction', $payload);

        $result = $response->json() ?? [
            'success' => false,
            'message' => 'Invalid response from Digiflazz',
            'raw' => $response->body(),
        ];

        Log::info('Digiflazz response', [
            'status' => $response->status(),
            'response' => $result,
        ]);

        return $result;
    }

    /**
     * Signature transaksi Digiflazz.
     *
     * Format:
     * md5(username + apiKey + ref_id)
     */
    protected function makeTransactionSignature(string $refId): string
    {
        return md5($this->username . $this->apiKey . $refId);
    }
}
