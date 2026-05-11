<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ProductSeeder extends Seeder
{
    /**
     * Seed the products table from JSON file.
     */
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/products.json');
        $categoriesJsonPath = database_path('seeders/data/product_categories.json');

        if (!File::exists($jsonPath)) {
            $this->command->warn("File not found: {$jsonPath}");
            return;
        }

        $products = json_decode(File::get($jsonPath), true);
        $productCategories = [];

        if (File::exists($categoriesJsonPath)) {
            $productCategories = json_decode(File::get($categoriesJsonPath), true);
        }

        foreach ($products as $productData) {
            $product = Product::updateOrCreate(
                ['id' => $productData['id']],
                [
                    'name' => $productData['name'],
                    'slug' => $productData['slug'],
                    'brand_id' => $productData['brand_id'],
                    'thumbnail' => $productData['thumbnail'],
                    'banner' => $productData['banner'],
                    'is_active' => $productData['is_active'] ?? true,
                    'description' => $productData['description'] ?? null,
                    'digiflazz_code' => $productData['digiflazz_code'] ?? null,
                    'digiflazz_synced_at' => $productData['digiflazz_synced_at'] ?? null,
                    'input_fields' => $productData['input_fields'] ?? null,
                    'customer_no_template' => $productData['customer_no_template'] ?? null,
                    'fulfillment_type' => $productData['fulfillment_type'] ?? null,
                    'created_at' => $productData['created_at'] ?? now(),
                    'updated_at' => $productData['updated_at'] ?? now(),
                ]
            );

            // Sync categories for this product
            $categoryIds = collect($productCategories)
                ->filter(fn($pc) => $pc['product_id'] == $product->id)
                ->pluck('category_id')
                ->all();

            if (!empty($categoryIds)) {
                $product->categories()->sync($categoryIds);
            }
        }

        $this->command->info('Products seeded successfully');
    }
}
