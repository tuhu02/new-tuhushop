<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class HistoryController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $transactions = Transaction::query()
            ->with(['paymentChannel.paymentMethod', 'product', 'productPrice'])
            ->where('customer_email', $user->email)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($transaction) {
                $productName = $transaction->product?->name ?? 'Produk';
                $priceName = $transaction->productPrice?->display_name ?? '';
                $fullName = trim($productName . ' - ' . $priceName, ' -');
                
                return [
                    'id' => $transaction->id,
                    'reference' => $transaction->reference,
                    'merchant_ref' => $transaction->merchant_ref,
                    'payment_channel_name' => $transaction->payment_channel_name,
                    'payment_method_name' => $transaction->payment_method_name,
                    'amount' => $transaction->amount,
                    'status' => $transaction->status,
                    'digiflazz_status' => $transaction->digiflazz_status,
                    'created_at' => $transaction->created_at->toIso8601String(),
                    'product_name' => $fullName,
                ];
            });

        return inertia('customer/history', [
            'transactions' => $transactions,
        ]);
    }
}
