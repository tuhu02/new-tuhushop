<?php

use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CarouselController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductPriceController;
use App\Http\Controllers\Admin\ProductInstructionController;
use App\Http\Controllers\Admin\PriceListCategoryController;
use App\Http\Controllers\Admin\PaymentMethodController;
use App\Http\Controllers\Admin\PaymentChannelController;
use App\Http\Controllers\Admin\DigiflazzSyncController;
use App\Http\Controllers\Customer\DashboardController;
use App\Http\Controllers\Customer\ProductController as CustomerProductController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
Route::get('/', [DashboardController::class, 'index'])->name('home');

// Route Customer
Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

Route::prefix('product')->name('product.')->group(function () {
    Route::get('{slug}', [CustomerProductController::class, 'index'])->name('show');
});

// route payment
Route::post('/checkout', [PaymentController::class, 'checkout'])->name('checkout');
Route::get('/checkout/{reference}', [PaymentController::class, 'showCheckout'])->name('checkout.show');
Route::get('/payment/success', fn() => redirect()->route('home'))->name('payment.success');

Route::middleware([])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    Route::resource('customers', CustomerController::class)->except('show');
    Route::resource('carousels', CarouselController::class)->except('show');
    Route::resource('brands', BrandController::class)->except('show');
    Route::resource('categories', CategoryController::class)->except('show');
    Route::resource('products', ProductController::class)->except('show');
    Route::resource('product-instructions', ProductInstructionController::class)->except('show');
    Route::resource('price-list-categories', PriceListCategoryController::class)->except('show');
    Route::resource('payment-methods', PaymentMethodController::class)->except('show');
    Route::post('payment-channels/sync-tripay', [PaymentChannelController::class, 'syncTripay'])
        ->name('payment-channels.sync-tripay');
    Route::resource('payment-channels', PaymentChannelController::class)->except('show');

    // Digiflazz sync routes
    Route::get('digiflazz/sync', [DigiflazzSyncController::class, 'index'])->name('digiflazz.index');
    Route::post('digiflazz/sync', [DigiflazzSyncController::class, 'sync'])->name('digiflazz.sync');
    Route::post('digiflazz/validate', [DigiflazzSyncController::class, 'validateCredentials'])->name('digiflazz.validate');
    Route::get('digiflazz/stats', [DigiflazzSyncController::class, 'getStats'])->name('digiflazz.stats');

    // Nested routes for product prices
    Route::resource('products.prices', ProductPriceController::class)->except('show');
});

require __DIR__ . '/settings.php';
