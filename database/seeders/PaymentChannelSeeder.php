<?php

namespace Database\Seeders;

use App\Models\PaymentChannel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class PaymentChannelSeeder extends Seeder
{
    /**
     * Seed the payment_channels table from JSON file.
     */
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/payment_channels.json');

        if (!File::exists($jsonPath)) {
            $this->command->warn("File not found: {$jsonPath}");
            return;
        }

        $paymentChannels = json_decode(File::get($jsonPath), true);

        foreach ($paymentChannels as $data) {
            $instructions = $data['instructions'] ?? null;

            PaymentChannel::updateOrCreate(
                ['id' => $data['id']],
                [
                    'payment_method_id' => $data['payment_method_id'],
                    'name' => $data['name'],
                    'code' => $data['code'],
                    'logo' => $data['logo'] ?? null,
                    'fee' => $data['fee'] ?? 0,
                    'fee_percent' => $data['fee_percent'] ?? 0,
                    'min_amount' => $data['min_amount'] ?? null,
                    'max_amount' => $data['max_amount'] ?? null,
                    'is_active' => $data['is_active'] ?? true,
                    'instructions' => $instructions,
                    'created_at' => $data['created_at'] ?? now(),
                    'updated_at' => $data['updated_at'] ?? now(),
                ]
            );
        }

        $this->command->info('Payment channels seeded successfully');
    }
}
