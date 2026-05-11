<?php

namespace Database\Seeders;

use App\Models\ProductPrice;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ProductPriceSeeder extends Seeder
{
    /**
     * Seed the product_prices table from JSON file.
     */
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/product_prices.json');

        if (!File::exists($jsonPath)) {
            $this->command->warn("File not found: {$jsonPath}");
            return;
        }

        $productPrices = json_decode(File::get($jsonPath), true);

        foreach ($productPrices as $data) {
            ProductPrice::updateOrCreate(
                ['id' => $data['id']],
                [
                    'product_id' => $data['product_id'],
                    'price_list_category_id' => $data['price_list_category_id'],
                    'display_name' => $data['display_name'],
                    'price' => $data['price'],
                    'order' => $data['order'] ?? 0,
                    'is_active' => $data['is_active'] ?? true,
                    'code' => $data['code'] ?? null,
                    'digiflazz_code' => $data['digiflazz_code'] ?? null,
                    'synced_at' => $data['synced_at'] ?? null,
                    'icon_id' => $data['icon_id'] ?? null,
                    'created_at' => $data['created_at'] ?? now(),
                    'updated_at' => $data['updated_at'] ?? now(),
                ]
            );
        }

        $this->command->info('Product prices seeded successfully');
    }
}
