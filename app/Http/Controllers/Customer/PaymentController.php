<?php

namespace App\Http\Controllers\Customer;

use App\Events\TransactionStatusUpdated;
use App\Http\Controllers\Controller;
use App\Models\PaymentChannel;
use App\Models\Transaction;
use App\Services\TripayService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(private TripayService $tripay) {}

    // Handle callback dari Tripay
    public function callback(Request $request)
    {
        $signature = $request->server('HTTP_X_CALLBACK_SIGNATURE', '');

        if (!$this->tripay->verifyCallback($signature)) {
            return response()->json(['message' => 'Invalid signature'], 400);
        }

        $data = $request->all();

        $transaction = Transaction::query()
            ->where('reference', $data['reference'] ?? null)
            ->orWhere('merchant_ref', $data['merchant_ref'] ?? null)
            ->first();

        if ($transaction !== null) {
            $previousStatus = (string) $transaction->status;

            $transaction->update([
                'status' => (string) ($data['status'] ?? $transaction->status),
                'raw_response' => $data,
                'expired_at' => isset($data['expired_time'])
                    ? now()->setTimestamp((int) $data['expired_time'])
                    : $transaction->expired_at,
                'pay_code' => $data['pay_code'] ?? $transaction->pay_code,
                'pay_url' => $data['pay_url'] ?? $transaction->pay_url,
            ]);

            $transaction->refresh();

            if ($previousStatus !== (string) $transaction->status) {
                broadcast(new TransactionStatusUpdated(
                    reference: (string) $transaction->reference,
                    status: (string) $transaction->status,
                    merchantRef: (string) $transaction->merchant_ref,
                ));
            }
        }

        if ($data['status'] === 'PAID') {
            // Update status order di database kamu
            // Order::where('ref', $data['merchant_ref'])->update(['status' => 'paid']);
        }

        return response()->json(['success' => true]);
    }

    public function checkStatus(string $reference)
    {
        $transaction = Transaction::query()
            ->where('reference', $reference)
            ->orWhere('merchant_ref', $reference)
            ->first();

        if ($transaction === null) {
            return response()->json([
                'message' => 'Transaksi tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'reference' => $transaction->reference,
            'merchant_ref' => $transaction->merchant_ref,
            'status' => $transaction->status,
        ]);
    }


    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'product_id'   => 'required|integer',
            'price_id'     => 'required|integer',
            'quantity'     => 'required|integer|min:1',
            'payment_code' => 'required|string',
            'phone_number' => 'required|string',
        ]);

        $normalizedPaymentCode = strtoupper(trim((string) $validated['payment_code']));

        $channel = PaymentChannel::query()
            ->whereRaw('UPPER(code) = ?', [$normalizedPaymentCode])
            ->where('is_active', true)
            ->first();

        if ($channel === null) {
            return response()->json([
                'message' => 'Metode pembayaran tidak tersedia. Silakan pilih metode lain.',
            ], 422);
        }

        $price = \App\Models\ProductPrice::findOrFail($request->price_id);

        $merchantRef = 'ORDER-' . time() . '-' . ($request->user()?->id ?? 'guest');
        $amount      = (int) ($price->price * $request->quantity);

        $result = $this->tripay->createTransaction([
            'method'         => $normalizedPaymentCode,
            'merchant_ref'   => $merchantRef,
            'amount'         => $amount,
            'customer_name'  => $request->user()?->name ?? 'Customer',
            'customer_email' => $request->user()?->email ?? 'customer@email.com',
            'customer_phone' => $request->phone_number,
            'order_items'    => [
                [
                    'name'     => $price->display_name,
                    'price'    => (int) $price->price,
                    'quantity' => $request->quantity,
                ]
            ],
            'return_url' => route('checkout.show', ['reference' => $merchantRef]),
        ]);

        if (!$result['success']) {
            return response()->json(['message' => $result['message']], 400);
        }

        $tripayData = $result['data'] ?? [];

        Transaction::query()->updateOrCreate(
            ['reference' => $tripayData['reference'] ?? $merchantRef],
            [
                'merchant_ref' => $merchantRef,
                'payment_channel_id' => $channel->id,
                'payment_channel_code' => $channel->code,
                'payment_channel_name' => $channel->name,
                'payment_method_code' => $channel->paymentMethod?->code,
                'payment_method_name' => $channel->paymentMethod?->name,
                'customer_name' => $request->user()?->name ?? 'Customer',
                'customer_email' => $request->user()?->email ?? 'customer@email.com',
                'customer_phone' => $request->phone_number,
                'product_id' => $price->product_id,
                'price_id' => $price->id,
                'quantity' => (int) $validated['quantity'],
                'amount' => (int) ($tripayData['amount'] ?? $amount),
                'fee_merchant' => data_get($tripayData, 'fee_merchant'),
                'fee_customer' => data_get($tripayData, 'fee_customer'),
                'amount_received' => data_get($tripayData, 'amount_received'),
                'pay_code' => $tripayData['pay_code'] ?? null,
                'pay_url' => $tripayData['pay_url'] ?? null,
                'checkout_url' => $tripayData['checkout_url'] ?? null,
                'status' => $tripayData['status'] ?? 'UNPAID',
                'expired_at' => isset($tripayData['expired_time'])
                    ? now()->setTimestamp((int) $tripayData['expired_time'])
                    : null,
                'instructions' => $tripayData['instructions'] ?? $channel->instructions,
                'raw_response' => $tripayData,
            ],
        );

        return response()->json([
            'redirect_url' => route('checkout.show', ['reference' => $merchantRef]),
        ]);
    }

    public function showCheckout(string $reference)
    {
        $transaction = Transaction::query()
            ->with('paymentChannel.paymentMethod')
            ->where('reference', $reference)
            ->orWhere('merchant_ref', $reference)
            ->firstOrFail();

        return inertia('customer/payment-checkout', [
            'transaction' => [
                'reference' => $transaction->reference,
                'merchant_ref' => $transaction->merchant_ref,
                'payment_channel_name' => $transaction->payment_channel_name,
                'payment_channel_code' => $transaction->payment_channel_code,
                'payment_method_name' => $transaction->payment_method_name,
                'amount' => $transaction->amount,
                'pay_code' => $transaction->pay_code,
                'pay_url' => $transaction->pay_url,
                'status' => $transaction->status,
                'expired_at' => optional($transaction->expired_at)?->toIso8601String(),
                'instructions' => $transaction->instructions ?? [],
            ],
        ]);
    }
}
