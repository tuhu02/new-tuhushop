<?php

use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CarouselController;
use App\Http\Controllers\Admin\ProductController;
use App\Models\Carousel;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
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
    })->name('dashboard');
});


Route::middleware([])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    Route::resource('customers', CustomerController::class)->except('show');
    Route::resource('carousels', CarouselController::class)->except('show');
    Route::resource('brands', BrandController::class)->except('show');
    Route::resource('categories', CategoryController::class)->except('show');
    Route::resource('products', ProductController::class)->except('show');
});

require __DIR__ . '/settings.php';
