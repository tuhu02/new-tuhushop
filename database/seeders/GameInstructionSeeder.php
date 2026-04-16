<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductInstruction;
use Illuminate\Database\Seeder;

class GameInstructionSeeder extends Seeder
{
    /**
     * Seed instructions for each game product.
     */
    public function run(): void
    {
        $instructionTemplates = [
            'mobile-legends-bang-bang' => [
                'title' => 'Cara Top Up Mobile Legends Diamonds',
                'content' => "1. Masukkan User ID dan Zone ID kamu\n2. Contoh: 1234567 (1234)\n3. Pilih nominal Diamonds yang kamu inginkan\n4. Selesaikan pembayaran\n5. Diamonds akan ditambahkan ke akun Mobile Legends kamu",
            ],
            'free-fire' => [
                'title' => 'Cara Top Up Free Fire Diamonds',
                'content' => "1. Masukkan User ID akun Free Fire kamu\n2. Contoh: 123456789\n3. Pilih nominal Diamonds yang kamu inginkan\n4. Selesaikan pembayaran\n5. Diamonds akan ditambahkan ke akun Free Fire kamu",
            ],
            'genshin-impact' => [
                'title' => 'Cara Top Up Genshin Impact Genesis Crystals',
                'content' => "1. Masukkan UID akun Genshin Impact kamu\n2. Contoh: 123456789\n3. Pilih nominal Genesis Crystals yang kamu inginkan\n4. Selesaikan pembayaran\n5. Genesis Crystals akan ditambahkan ke akun kamu",
            ],
            'honkai-star-rail' => [
                'title' => 'Cara Top Up Honkai: Star Rail Oneiric Shard',
                'content' => "1. Masukkan UID akun Honkai: Star Rail kamu\n2. Contoh: 123456789\n3. Pilih nominal Oneiric Shard yang kamu inginkan\n4. Selesaikan pembayaran\n5. Oneiric Shard akan ditambahkan ke akun kamu",
            ],
            'pubg-mobile' => [
                'title' => 'Cara Top Up PUBG Mobile UC',
                'content' => "1. Masukkan Player ID akun PUBG Mobile kamu\n2. Contoh: 1234567890\n3. Pilih nominal UC yang kamu inginkan\n4. Selesaikan pembayaran\n5. UC akan ditambahkan ke akun PUBG Mobile kamu",
            ],
            'valorant-points' => [
                'title' => 'Cara Top Up Valorant Points',
                'content' => "1. Masukkan Riot ID kamu\n2. Contoh: Player#1234\n3. Pilih nominal Valorant Points yang kamu inginkan\n4. Selesaikan pembayaran\n5. Valorant Points akan dikirim ke akun kamu",
            ],
            'roblox' => [
                'title' => 'Cara Top Up Roblox Robux',
                'content' => "1. Masukkan username akun Roblox kamu\n2. Contoh: namauser123\n3. Pilih nominal Robux yang kamu inginkan\n4. Selesaikan pembayaran\n5. Robux akan ditambahkan ke akun Roblox kamu",
            ],
        ];

        foreach ($instructionTemplates as $productSlug => $instruction) {
            $product = Product::query()->where('slug', $productSlug)->first();

            if ($product === null) {
                continue;
            }

            ProductInstruction::query()->updateOrCreate(
                [
                    'product_id' => $product->id,
                    'title' => $instruction['title'],
                ],
                [
                    'content' => $instruction['content'],
                ],
            );
        }
    }
}
