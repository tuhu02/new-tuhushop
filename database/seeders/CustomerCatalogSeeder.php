<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CustomerCatalogSeeder extends Seeder
{
    /**
     * Seed customer catalog (categories, brands, products) using logos in public/logo game.
     */
    public function run(): void
    {
        $categoryNames = ['🔥 Lagi Populer', 'Top Up Langsung', 'PPOB'];

        $categories = collect($categoryNames)
            ->mapWithKeys(function (string $name): array {
                $category = Category::query()->updateOrCreate(
                    ['slug' => Str::slug($name)],
                    [
                        'name' => $name,
                        'is_active' => true,
                    ],
                );

                return [$name => $category];
            });

        $catalog = [
            [
                'name' => 'Mobile Legends: Bang Bang',
                'slug' => 'mobile-legends-bang-bang',
                'brand' => 'Moonton',
                'logo' => 'MLBB_icon.webp',
                'categories' => ['🔥 Lagi Populer', 'Top Up Langsung'],
                'input_fields' => [
                    'fields' => [
                        ['name' => 'user_id', 'label' => 'User ID', 'type' => 'text', 'required' => true],
                        ['name' => 'zone_id', 'label' => 'Zone ID', 'type' => 'text', 'required' => true],
                    ],
                ],
                'customer_no_template' => '{user_id}|{zone_id}',
            ],
            [
                'name' => 'Free Fire',
                'slug' => 'free-fire',
                'brand' => 'Garena',
                'logo' => 'free-fire.jpg',
                'categories' => ['🔥 Lagi Populer', 'Top Up Langsung'],
                'input_fields' => [
                    'fields' => [
                        ['name' => 'user_id', 'label' => 'Player ID', 'type' => 'text', 'required' => true],
                    ],
                ],
                'customer_no_template' => '{user_id}',
            ],
            [
                'name' => 'Genshin Impact',
                'slug' => 'genshin-impact',
                'brand' => 'HoYoverse',
                'logo' => 'genshin-impact.jpeg',
                'categories' => ['Top Up Langsung'],
                'input_fields' => [
                    'fields' => [
                        ['name' => 'user_id', 'label' => 'UID', 'type' => 'text', 'required' => true],
                        ['name' => 'server', 'label' => 'Server', 'type' => 'text', 'required' => true],
                    ],
                ],
                'customer_no_template' => '{user_id}|{server}',
            ],
            [
                'name' => 'Honkai: Star Rail',
                'slug' => 'honkai-star-rail',
                'brand' => 'HoYoverse',
                'logo' => 'honkai-star-rail.jpeg',
                'categories' => ['Top Up Langsung'],
                'input_fields' => [
                    'fields' => [
                        ['name' => 'user_id', 'label' => 'UID', 'type' => 'text', 'required' => true],
                        ['name' => 'server', 'label' => 'Server', 'type' => 'text', 'required' => true],
                    ],
                ],
                'customer_no_template' => '{user_id}|{server}',
            ],
            [
                'name' => 'PUBG Mobile',
                'slug' => 'pubg-mobile',
                'brand' => 'KRAFTON',
                'logo' => 'pubg-mobile.jpeg',
                'categories' => ['Top Up Langsung'],
                'input_fields' => [
                    'fields' => [
                        ['name' => 'user_id', 'label' => 'Player ID', 'type' => 'text', 'required' => true],
                    ],
                ],
                'customer_no_template' => '{user_id}',
            ],
            [
                'name' => 'Valorant Points',
                'slug' => 'valorant-points',
                'brand' => 'Riot Games',
                'logo' => 'valorant.jpeg',
                'categories' => ['Top Up Langsung'],
                'input_fields' => [
                    'fields' => [
                        ['name' => 'riot_id', 'label' => 'Riot ID', 'type' => 'text', 'required' => true],
                    ],
                ],
                'customer_no_template' => '{riot_id}',
            ],
            [
                'name' => 'Roblox',
                'slug' => 'roblox',
                'brand' => 'Roblox',
                'logo' => 'roblox.jpg',
                'categories' => ['🔥 Lagi Populer', 'Top Up Langsung'],
                'input_fields' => [
                    'fields' => [
                        ['name' => 'username', 'label' => 'Username Roblox', 'type' => 'text', 'required' => true],
                    ],
                ],
                'customer_no_template' => '{username}',
            ],
        ];

        $logoSourceDir = public_path('logo game');

        foreach ($catalog as $item) {
            $brand = Brand::query()->firstOrCreate([
                'name' => $item['brand'],
            ]);

            $thumbnailPath = null;
            $sourceFilePath = $logoSourceDir . DIRECTORY_SEPARATOR . $item['logo'];

            if (File::exists($sourceFilePath)) {
                $extension = strtolower(pathinfo($item['logo'], PATHINFO_EXTENSION));
                $fileName = Str::slug($item['slug']) . '.' . $extension;
                $thumbnailPath = 'products/' . $fileName;

                Storage::disk('public')->put($thumbnailPath, File::get($sourceFilePath));
            }

            $product = Product::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'name' => $item['name'],
                    'slug' => $item['slug'],
                    'description' => 'Top up ' . $item['name'] . ' cepat, aman, dan resmi.',
                    'brand_id' => $brand->id,
                    'thumbnail' => $thumbnailPath,
                    'banner' => $thumbnailPath,
                    'is_active' => true,
                    'input_fields' => $item['input_fields'],
                    'customer_no_template' => $item['customer_no_template'],
                ],
            );

            $categoryIds = collect($item['categories'])
                ->map(fn(string $categoryName): ?int => $categories->get($categoryName)?->id)
                ->filter()
                ->values()
                ->all();

            $product->categories()->sync($categoryIds);
        }
    }
}
