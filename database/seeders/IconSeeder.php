<?php

namespace Database\Seeders;

use App\Models\Icon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class IconSeeder extends Seeder
{
    /**
     * Seed the icons table from JSON file.
     */
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/icons.json');

        if (!File::exists($jsonPath)) {
            $this->command->warn("File not found: {$jsonPath}");
            return;
        }

        $icons = json_decode(File::get($jsonPath), true);

        foreach ($icons as $data) {
            Icon::updateOrCreate(
                ['id' => $data['id']],
                [
                    'name' => $data['name'],
                    'file_path' => $data['file_path'],
                    'created_at' => $data['created_at'] ?? now(),
                    'updated_at' => $data['updated_at'] ?? now(),
                ]
            );
        }

        $this->command->info('Icons seeded successfully');
    }
}
