<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Customer\TransactionController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Callback dari Tripay
Route::post('/tripay/callback', [TransactionController::class, 'callback']);
Route::get('/check-status/{reference}', [TransactionController::class, 'checkStatus'])->middleware('throttle:30,1');
Route::post('/digiflazz/webhook', [TransactionController::class, 'digiflazzCallback']);
