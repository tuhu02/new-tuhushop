<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->with([
                'brand',
                'categories:id,name',
                'instructions',
                'prices' => function ($query) {
                    $query->with('category')->orderBy('price_list_category_id')->orderBy('order');
                }
            ])
            ->firstOrFail();

        $pricesByCategory = $product->prices->groupBy('price_list_category_id')->map(function ($prices) {
            return [
                'category' => $prices->first()->category,
                'prices' => $prices->values(),
            ];
        })->values();


        $user = Auth::user();

        return Inertia::render('customer/product-show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'brand' => $product->brand?->name,
                'categories' => $product->categories->pluck('name')->values(),
                'thumbnail' => $product->thumbnail,
                'thumbnail_url' => $product->thumbnail !== null
                    ? asset('storage/' . $product->thumbnail)
                    : null,
                'banner' => $product->banner,
                'banner_url' => $product->banner !== null
                    ? asset('storage/' . $product->banner)
                    : null,
                'instructions' => $product->instructions->map(function ($instruction) {
                    return [
                        'title' => $instruction->title,
                        'content' => $instruction->content,
                    ];
                })->values(),
            ],

            'pricesByCategory' => $pricesByCategory,
            'user' => $user,
        ]);
    }
}
