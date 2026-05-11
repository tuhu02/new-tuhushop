<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class CategorySeeder extends Seeder
{
    /**
     * Seed the categories table from JSON file.
     */
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/categories.json');

        if (!File::exists($jsonPath)) {
            $this->command->warn("File not found: {$jsonPath}");
            return;
        }

        $categories = json_decode(File::get($jsonPath), true);

        foreach ($categories as $categoryData) {
            Category::updateOrCreate(
                ['id' => $categoryData['id']],
                [
                    'name' => $categoryData['name'],
                    'slug' => $categoryData['slug'],
                    'is_active' => $categoryData['is_active'] ?? true,
                    'created_at' => $categoryData['created_at'] ?? now(),
                    'updated_at' => $categoryData['updated_at'] ?? now(),
                ]
            );
        }

        $this->command->info('Categories seeded successfully');
    }
}
