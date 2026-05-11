<?php

namespace Database\Seeders;

use App\Models\ProductInstruction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ProductInstructionSeeder extends Seeder
{
    /**
     * Seed the product_instructions table from JSON file.
     */
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/product_instructions.json');

        if (!File::exists($jsonPath)) {
            $this->command->warn("File not found: {$jsonPath}");
            return;
        }

        $productInstructions = json_decode(File::get($jsonPath), true);

        foreach ($productInstructions as $data) {
            ProductInstruction::updateOrCreate(
                ['id' => $data['id']],
                [
                    'product_id' => $data['product_id'],
                    'title' => $data['title'],
                    'content' => $data['content'],
                    'created_at' => $data['created_at'] ?? now(),
                    'updated_at' => $data['updated_at'] ?? now(),
                ]
            );
        }

        $this->command->info('Product instructions seeded successfully');
    }
}
