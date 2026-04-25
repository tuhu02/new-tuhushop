<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Customer\PaymentController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Callback dari Tripay
Route::post('/tripay/callback', [PaymentController::class, 'callback']);
Route::get('/check-status/{reference}', [PaymentController::class, 'checkStatus']);
