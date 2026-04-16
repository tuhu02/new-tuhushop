<?php

namespace Database\Seeders;

use App\Models\PriceListCategory;
use App\Models\Product;
use App\Models\ProductPrice;
use Illuminate\Database\Seeder;

class GameNominalSeeder extends Seeder
{
    /**
     * Seed nominal price lists for each game product.
     */
    public function run(): void
    {
        $nominalCategory = PriceListCategory::query()->updateOrCreate(
            ['slug' => 'nominal'],
            [
                'name' => 'Nominal',
                'description' => 'Daftar nominal top up untuk setiap game',
                'order' => 0,
                'is_active' => true,
            ],
        );

        $priceMap = [
            'mobile-legends-bang-bang' => [
                ['display_name' => '5 Diamond', 'code' => 'mlbb-5', 'price' => 1500],
                ['display_name' => '12 Diamond', 'code' => 'mlbb-12', 'price' => 3500],
                ['display_name' => '19 Diamond', 'code' => 'mlbb-19', 'price' => 5500],
                ['display_name' => '28 Diamond', 'code' => 'mlbb-28', 'price' => 7500],
                ['display_name' => '44 Diamond', 'code' => 'mlbb-44', 'price' => 11500],
                ['display_name' => '86 Diamond', 'code' => 'mlbb-86', 'price' => 21500],
                ['display_name' => '172 Diamond', 'code' => 'mlbb-172', 'price' => 42500],
                ['display_name' => '257 Diamond', 'code' => 'mlbb-257', 'price' => 61500],
                ['display_name' => '344 Diamond', 'code' => 'mlbb-344', 'price' => 82500],
                ['display_name' => '514 Diamond', 'code' => 'mlbb-514', 'price' => 122500],
                ['display_name' => '706 Diamond', 'code' => 'mlbb-706', 'price' => 167500],
            ],
            'free-fire' => [
                ['display_name' => '70 Diamond', 'code' => 'ff-70', 'price' => 10000],
                ['display_name' => '140 Diamond', 'code' => 'ff-140', 'price' => 19000],
                ['display_name' => '355 Diamond', 'code' => 'ff-355', 'price' => 47000],
                ['display_name' => '720 Diamond', 'code' => 'ff-720', 'price' => 93000],
                ['display_name' => '1450 Diamond', 'code' => 'ff-1450', 'price' => 185000],
                ['display_name' => '2180 Diamond', 'code' => 'ff-2180', 'price' => 275000],
                ['display_name' => '3640 Diamond', 'code' => 'ff-3640', 'price' => 455000],
            ],
            'genshin-impact' => [
                ['display_name' => '60 Genesis Crystals', 'code' => 'genshin-60', 'price' => 15000],
                ['display_name' => '300 Genesis Crystals', 'code' => 'genshin-300', 'price' => 75000],
                ['display_name' => '980 Genesis Crystals', 'code' => 'genshin-980', 'price' => 149000],
                ['display_name' => '1980 Genesis Crystals', 'code' => 'genshin-1980', 'price' => 299000],
                ['display_name' => '3280 Genesis Crystals', 'code' => 'genshin-3280', 'price' => 489000],
                ['display_name' => '6480 Genesis Crystals', 'code' => 'genshin-6480', 'price' => 949000],
            ],
            'honkai-star-rail' => [
                ['display_name' => '60 Oneiric Shard', 'code' => 'hsr-60', 'price' => 15000],
                ['display_name' => '300 Oneiric Shard', 'code' => 'hsr-300', 'price' => 75000],
                ['display_name' => '980 Oneiric Shard', 'code' => 'hsr-980', 'price' => 149000],
                ['display_name' => '1980 Oneiric Shard', 'code' => 'hsr-1980', 'price' => 299000],
                ['display_name' => '3280 Oneiric Shard', 'code' => 'hsr-3280', 'price' => 489000],
                ['display_name' => '6480 Oneiric Shard', 'code' => 'hsr-6480', 'price' => 949000],
            ],
            'pubg-mobile' => [
                ['display_name' => '60 UC', 'code' => 'pubg-60', 'price' => 12000],
                ['display_name' => '325 UC', 'code' => 'pubg-325', 'price' => 65000],
                ['display_name' => '660 UC', 'code' => 'pubg-660', 'price' => 130000],
                ['display_name' => '1800 UC', 'code' => 'pubg-1800', 'price' => 350000],
                ['display_name' => '3850 UC', 'code' => 'pubg-3850', 'price' => 740000],
                ['display_name' => '8100 UC', 'code' => 'pubg-8100', 'price' => 1390000],
            ],
            'valorant-points' => [
                ['display_name' => '125 VP', 'code' => 'valorant-125', 'price' => 15000],
                ['display_name' => '250 VP', 'code' => 'valorant-250', 'price' => 30000],
                ['display_name' => '420 VP', 'code' => 'valorant-420', 'price' => 50000],
                ['display_name' => '700 VP', 'code' => 'valorant-700', 'price' => 80000],
                ['display_name' => '1375 VP', 'code' => 'valorant-1375', 'price' => 150000],
                ['display_name' => '2400 VP', 'code' => 'valorant-2400', 'price' => 250000],
                ['display_name' => '5350 VP', 'code' => 'valorant-5350', 'price' => 560000],
            ],
            'roblox' => [
                ['display_name' => '40 Robux', 'code' => 'roblox-40', 'price' => 12000],
                ['display_name' => '80 Robux', 'code' => 'roblox-80', 'price' => 23000],
                ['display_name' => '160 Robux', 'code' => 'roblox-160', 'price' => 45000],
                ['display_name' => '400 Robux', 'code' => 'roblox-400', 'price' => 110000],
                ['display_name' => '800 Robux', 'code' => 'roblox-800', 'price' => 220000],
                ['display_name' => '1700 Robux', 'code' => 'roblox-1700', 'price' => 460000],
                ['display_name' => '4500 Robux', 'code' => 'roblox-4500', 'price' => 1200000],
            ],
        ];

        foreach ($priceMap as $productSlug => $prices) {
            $product = Product::query()->where('slug', $productSlug)->first();

            if ($product === null) {
                continue;
            }

            foreach ($prices as $order => $priceData) {
                ProductPrice::query()->updateOrCreate(
                    [
                        'product_id' => $product->id,
                        'code' => $priceData['code'],
                    ],
                    [
                        'price_list_category_id' => $nominalCategory->id,
                        'display_name' => $priceData['display_name'],
                        'price' => $priceData['price'],
                        'order' => $order,
                        'is_active' => true,
                    ],
                );
            }
        }
    }
}
