<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index($slug)
    {
        $product = Product::where('slug', $slug)
            ->with([
                'brand',
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

        $user = auth()->user();

        return Inertia::render('customer/product-show', [
            'product' => $product,
            'pricesByCategory' => $pricesByCategory,
            'user' => $user,
        ]);
    }
}
