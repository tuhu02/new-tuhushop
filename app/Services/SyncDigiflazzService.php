<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductPrice;
use App\Models\PriceListCategory;
use App\Models\Brand;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SyncDigiflazzService
{
    private DigiflazzService $digiflazzService;
    private int $syncedCount = 0;
    private int $errorCount = 0;

    public function __construct(DigiflazzService $digiflazzService)
    {
        $this->digiflazzService = $digiflazzService;
    }

    /**
     * Sync price list from Digiflazz
     *
     * @return array
     */
    public function sync(): array
    {
        Log::info('Starting Digiflazz price list sync');

        $products = $this->digiflazzService->getPriceList();

        if ($products === null) {
            $apiMessage = $this->digiflazzService->getLastError() ?? 'Unknown Digiflazz API error';
            Log::error('Failed to fetch Digiflazz price list');
            return [
                'success' => false,
                'message' => 'Failed to fetch price list from Digiflazz: ' . $apiMessage,
                'synced' => 0,
                'errors' => 1,
            ];
        }

        if (empty($products)) {
            Log::warning('No products received from Digiflazz');
            return [
                'success' => true,
                'message' => 'No products to sync',
                'synced' => 0,
                'errors' => 0,
            ];
        }

        foreach ($products as $productData) {
            try {
                $this->syncProduct($productData);
            } catch (\Exception $e) {
                Log::error('Error syncing product: ' . $e->getMessage(), [
                    'product_code' => $productData['code'] ?? 'unknown',
                    'error' => $e->getMessage(),
                ]);
                $this->errorCount++;
            }
        }

        $message = "Sync completed. {$this->syncedCount} products synced";
        if ($this->errorCount > 0) {
            $message .= ", {$this->errorCount} errors";
        }

        Log::info($message);

        return [
            'success' => true,
            'message' => $message,
            'synced' => $this->syncedCount,
            'errors' => $this->errorCount,
        ];
    }

    /**
     * Sync individual product
     *
     * @param array $productData
     * @return void
     */
    private function syncProduct(array $productData): void
    {
        $code = $productData['digiflazz_code'] ?? $productData['code'] ?? null;
        if (!$code) {
            throw new \Exception('Product code is missing');
        }

        // Extract category from code or use default
        $categoryName = $productData['category'] ?? 'General';
        $category = PriceListCategory::firstOrCreate(
            ['slug' => Str::slug($categoryName)],
            [
                'name' => $categoryName,
                'description' => "Digiflazz $categoryName",
                'order' => 0,
                'is_active' => true,
            ]
        );

        // Map Digiflazz item to an existing storefront product (prefer brand match).
        $product = $this->resolveOrCreateProduct($productData);

        // Update product digiflazz_synced_at
        $product->update(['digiflazz_synced_at' => now()]);

        // Create or update product price
        $displayName = $productData['nominal'] ?? $productData['name'] ?? $code;

        ProductPrice::updateOrCreate(
            [
                'product_id' => $product->id,
                'digiflazz_code' => $code,
            ],
            [
                'price_list_category_id' => $category->id,
                'display_name' => $displayName,
                'code' => $code,
                'price' => (int) ($productData['price'] ?? 0),
                'order' => 0,
                'is_active' => true,
                'synced_at' => now(),
            ]
        );

        $this->syncedCount++;
    }

    /**
     * Resolve Digiflazz row to product. Reuse existing catalog products when possible.
     */
    private function resolveOrCreateProduct(array $productData): Product
    {
        $brandName = trim((string) ($productData['brand'] ?? ''));
        $candidateName = trim((string) ($productData['name'] ?? $brandName));

        if ($brandName !== '') {
            $matchedByBrand = Product::query()
                ->where('name', 'like', '%' . $brandName . '%')
                ->orWhere('slug', 'like', '%' . Str::slug($brandName) . '%')
                ->first();

            if ($matchedByBrand !== null) {
                return $matchedByBrand;
            }
        }

        $searchToken = $candidateName;
        if (str_contains($candidateName, ' - ')) {
            $searchToken = explode(' - ', $candidateName, 2)[0] ?? $candidateName;
        }

        $matchedByName = Product::query()
            ->where('name', 'like', '%' . $searchToken . '%')
            ->orWhere('slug', 'like', '%' . Str::slug($searchToken) . '%')
            ->first();

        if ($matchedByName !== null) {
            return $matchedByName;
        }

        $brand = Brand::query()->firstOrCreate([
            'name' => $brandName !== '' ? $brandName : 'Digiflazz',
        ]);

        $baseName = $brandName !== '' ? Str::title(Str::lower($brandName)) : $candidateName;
        $baseSlug = Str::slug($baseName !== '' ? $baseName : 'digiflazz-product');
        $slug = $baseSlug;
        $counter = 2;

        while (Product::query()->where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return Product::query()->create([
            'name' => $baseName !== '' ? $baseName : 'Digiflazz Product',
            'slug' => $slug,
            'price' => (int) ($productData['price'] ?? 0),
            'description' => $productData['desc'] ?? 'Auto-created from Digiflazz sync.',
            'brand_id' => $brand->id,
            'is_active' => true,
        ]);
    }

    /**
     * Get sync statistics
     *
     * @return array
     */
    public function getStats(): array
    {
        return [
            'total_products' => Product::count(),
            'synced_products' => Product::whereNotNull('digiflazz_synced_at')->count(),
            'total_prices' => ProductPrice::count(),
            'synced_prices' => ProductPrice::whereNotNull('synced_at')->count(),
        ];
    }
}
