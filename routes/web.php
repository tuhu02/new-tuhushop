<?php

use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CarouselController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductPriceController;
use App\Http\Controllers\Admin\PriceListCategoryController;
use App\Http\Controllers\Customer\DashboardController;
use App\Http\Controllers\Customer\ProductController as CustomerProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// Route Customer
Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

Route::prefix('product')->name('product.')->group(function () {
    Route::get('{slug}', [CustomerProductController::class, 'index'])->name('show');
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
    Route::resource('price-list-categories', PriceListCategoryController::class)->except('show');

    // Nested routes for product prices
    Route::resource('products.prices', ProductPriceController::class)->except('show');
});

require __DIR__ . '/settings.php';
