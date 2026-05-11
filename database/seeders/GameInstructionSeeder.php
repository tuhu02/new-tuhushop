<?php

namespace Database\Seeders;

use App\Models\ProductInstruction;
use Illuminate\Database\Seeder;

class GameInstructionSeeder extends Seeder
{
    /**
     * Seed instructions from exported database data.
     */
    public function run(): void
    {
        $instructions = json_decode(
            file_get_contents(database_path('seeders/data/product_instructions.json')),
            true
        );

        foreach ($instructions as $instruction) {
            ProductInstruction::query()->updateOrCreate(
                [
                    'id' => $instruction['id'],
                ],
                [
                    'product_id' => $instruction['product_id'],
                    'title' => $instruction['title'],
                    'content' => $instruction['content'],
                    'created_at' => $instruction['created_at'],
                    'updated_at' => $instruction['updated_at'],
                ]
            );
        }
    }
}
