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
use App\Http\Controllers\Admin\IconController;
use App\Http\Controllers\Admin\ManualTransactionController;
use App\Http\Controllers\Admin\TransactionController as AdminTransactionController;
use App\Http\Controllers\Customer\TransactionController;
use App\Http\Controllers\Customer\DashboardController;
use App\Http\Controllers\Customer\ProductController as CustomerProductController;
use App\Http\Controllers\Customer\HistoryController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use Inertia\Inertia;



Route::get('/', [DashboardController::class, 'index'])->name('home');

// Route Customer
Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::middleware(['auth'])->group(function () {
    Route::get('history', [HistoryController::class, 'index'])->name('history');
});

Route::prefix('product')->name('product.')->group(function () {
    Route::get('{slug}', [CustomerProductController::class, 'index'])->name('show');
});

// Route Transaction
Route::post('/checkout', [TransactionController::class, 'checkout'])->name('checkout');
Route::get('/checkout/{reference}', [TransactionController::class, 'showCheckout'])->name('checkout.show');
Route::get('/payment/success', fn() => redirect()->route('home'))->name('payment.success');

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

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

    // Icons
    Route::resource('icons', IconController::class)->only(['index', 'store', 'destroy']);

    // Manual Transactions (must be before resource routes to avoid conflict)
    Route::get('transactions/manual', [ManualTransactionController::class, 'index'])->name('transactions.manual');
    Route::post('transactions/manual/{id}/process', [ManualTransactionController::class, 'process'])->name('transactions.manual.process');

    // Transactions
    Route::resource('transactions', TransactionController::class)->only('index');

    // Nested routes for product prices
    Route::post('products/{product}/prices/import', [ProductPriceController::class, 'import'])->name('products.prices.import');
    Route::resource('products.prices', ProductPriceController::class)->except('show');
});

require __DIR__ . '/settings.php';
