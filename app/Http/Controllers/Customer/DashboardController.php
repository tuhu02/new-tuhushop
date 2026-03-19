<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Carousel;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $carousels = Carousel::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->latest('id')
            ->get()
            ->map(function (Carousel $carousel): array {
                return [
                    'id' => $carousel->id,
                    'title' => $carousel->title,
                    'image_url' => asset('storage/' . $carousel->image_path),
                ];
            });

        $products = Product::query()
            ->with(['brand:id,name', 'categories:id,name'])
            ->where('is_active', true)
            ->latest()
            ->get()
            ->map(function (Product $product): array {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'thumbnail_url' => $product->thumbnail !== null
                        ? asset('storage/' . $product->thumbnail)
                        : null,
                    'brand' => $product->brand?->name,
                    'categories' => $product->categories->pluck('name')->values(),
                ];
            });

        return Inertia::render('customer/dashboard', [
            'carousels' => $carousels,
            'products' => $products,
        ]);
    }
}
