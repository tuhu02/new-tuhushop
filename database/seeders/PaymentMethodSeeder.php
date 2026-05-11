<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Seed the payment_methods table from JSON file.
     */
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/payment_methods.json');

        if (!File::exists($jsonPath)) {
            $this->command->warn("File not found: {$jsonPath}");
            return;
        }

        $paymentMethods = json_decode(File::get($jsonPath), true);

        foreach ($paymentMethods as $data) {
            PaymentMethod::updateOrCreate(
                ['id' => $data['id']],
                [
                    'name' => $data['name'],
                    'code' => $data['code'],
                    'is_active' => $data['is_active'] ?? true,
                    'logo' => $data['logo'] ?? null,
                    'created_at' => $data['created_at'] ?? now(),
                    'updated_at' => $data['updated_at'] ?? now(),
                ]
            );
        }

        $this->command->info('Payment methods seeded successfully');
    }
}
