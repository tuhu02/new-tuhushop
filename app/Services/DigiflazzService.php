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
        $this->username = (string) env('DIGIFLAZZ_USERNAME');
        $this->apiKey = (string) env('DIGIFLAZZ_API_KEY');
        $this->baseUrl = 'https://api.digiflazz.com/v1';

        Log::info('DIGIFLAZZ CONFIG CHECK', [
            'username_exists' => $this->username !== '',
            'api_key_exists' => $this->apiKey !== '',
            'base_url' => $this->baseUrl,
        ]);
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
            'testing' => true,
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
