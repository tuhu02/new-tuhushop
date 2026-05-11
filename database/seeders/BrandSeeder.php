<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class BrandSeeder extends Seeder
{
    /**
     * Seed the brands table from JSON file.
     */
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/brands.json');

        if (!File::exists($jsonPath)) {
            $this->command->warn("File not found: {$jsonPath}");
            return;
        }

        $brands = json_decode(File::get($jsonPath), true);

        foreach ($brands as $brandData) {
            Brand::updateOrCreate(
                ['id' => $brandData['id']],
                [
                    'name' => $brandData['name'],
                    'created_at' => $brandData['created_at'] ?? now(),
                    'updated_at' => $brandData['updated_at'] ?? now(),
                ]
            );
        }

        $this->command->info('Brands seeded successfully');
    }
}
