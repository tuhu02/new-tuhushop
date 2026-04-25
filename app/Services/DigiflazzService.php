<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DigiflazzService
{
    private string $username;
    private string $apiKey;
    private string $baseUrl = 'https://api.digiflazz.com/v1';
    private ?string $lastError = null;

    public function __construct()
    {
        $this->username = config('digiflazz.digiflazz.username') ?? env('DIGIFLAZZ_USERNAME');
        $this->apiKey = config('digiflazz.digiflazz.api_key') ?? env('DIGIFLAZZ_API_KEY');
    }

    /**
     * Get product list from Digiflazz API
     *
     * @return array|null
     */
    public function getPriceList(): ?array
    {
        $this->lastError = null;

        try {
            $response = Http::timeout(30)->post("{$this->baseUrl}/price-list", [
                'username' => $this->username,
                'key' => $this->apiKey,
            ]);

            if ($response->failed()) {
                $this->lastError = 'HTTP ' . $response->status() . ' from Digiflazz API';
                Log::error('Digiflazz API Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return null;
            }

            $data = $response->json();

            // Check if response has data and is valid
            if (isset($data['data']) && is_array($data['data'])) {
                // Check for error in response
                if (isset($data['data']['rc']) && $data['data']['rc'] !== '00') {
                    $message = $data['data']['message'] ?? 'Unknown error';
                    $this->lastError = $message;
                    Log::error('Digiflazz API Error: ' . $message, ['rc' => $data['data']['rc']]);
                    return null;
                }

                if (array_is_list($data['data'])) {
                    return $this->parseProducts($data['data']);
                }
            }

            // Check old format with status='success'
            if (isset($data['status']) && $data['status'] === 'success' && isset($data['data']) && is_array($data['data'])) {
                return $this->parseProducts($data['data']);
            }

            $this->lastError = 'Unexpected Digiflazz response format';
            Log::error('Digiflazz API Response Error', ['response' => $data]);
            return null;
        } catch (\Exception $e) {
            $this->lastError = $e->getMessage();
            Log::error('Digiflazz Service Error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Parse Digiflazz product data
     *
     * @param array $products
     * @return array
     */
    public function parseProducts(array $products): array
    {
        $parsed = [];

        foreach ($products as $product) {
            $code = $product['buyer_sku_code'] ?? $product['code'] ?? null;
            $name = $product['product_name'] ?? $product['name'] ?? null;
            $category = $product['category'] ?? null;
            $brand = $product['brand'] ?? null;

            // For names like "MOBILELEGEND - 86 Diamond", keep the right side as nominal.
            $nominal = $product['nominal'] ?? null;
            if ($nominal === null && is_string($name) && str_contains($name, ' - ')) {
                $parts = explode(' - ', $name, 2);
                $nominal = $parts[1] ?? $name;
            }

            $parsed[] = [
                'digiflazz_code' => $code,
                'name' => $name,
                'category' => $category,
                'brand' => $brand,
                'nominal' => $nominal,
                'price' => (int) ($product['price'] ?? 0),
                'desc' => $product['desc'] ?? null,
            ];
        }

        return $parsed;
    }

    /**
     * Validate API credentials
     *
     * @return bool
     */
    public function validateCredentials(): bool
    {
        try {
            $response = Http::post("{$this->baseUrl}/price-list", [
                'username' => $this->username,
                'key' => $this->apiKey,
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Digiflazz Validation Error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get the latest Digiflazz API error in plain text.
     */
    public function getLastError(): ?string
    {
        return $this->lastError;
    }
}
