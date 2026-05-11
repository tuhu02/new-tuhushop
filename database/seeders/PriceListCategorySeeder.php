<?php

namespace Database\Seeders;

use App\Models\PriceListCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class PriceListCategorySeeder extends Seeder
{
    /**
     * Seed the price_list_categories table from JSON file.
     */
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/price_list_categories.json');

        if (!File::exists($jsonPath)) {
            $this->command->warn("File not found: {$jsonPath}");
            return;
        }

        $priceListCategories = json_decode(File::get($jsonPath), true);

        foreach ($priceListCategories as $data) {
            PriceListCategory::updateOrCreate(
                ['id' => $data['id']],
                [
                    'name' => $data['name'],
                    'slug' => $data['slug'],
                    'description' => $data['description'] ?? null,
                    'order' => $data['order'] ?? 0,
                    'is_active' => $data['is_active'] ?? true,
                    'created_at' => $data['created_at'] ?? now(),
                    'updated_at' => $data['updated_at'] ?? now(),
                ]
            );
        }

        $this->command->info('Price list categories seeded successfully');
    }
}
