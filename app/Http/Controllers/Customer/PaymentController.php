<?php

namespace App\Http\Controllers\Customer;

use App\Events\TransactionStatusUpdated;
use App\Http\Controllers\Controller;
use App\Models\PaymentChannel;
use App\Models\Product;
use App\Models\ProductPrice;
use App\Models\Transaction;
use App\Services\DigiflazzService;
use App\Services\TripayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Events\DigiflazzStatusUpdated;

class PaymentController extends Controller
{
    public function __construct(private TripayService $tripay) {}

    public function callback(Request $request)
    {
        Log::info('CALLBACK MASUK', $request->all());

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

        if (($data['status'] ?? null) === 'PAID' && $transaction !== null) {
            Log::info('STATUS PAID MASUK');

            if ($transaction->digiflazz_processed_at !== null) {
                return response()->json(['success' => true]);
            }

            $price = ProductPrice::find($transaction->price_id);
            $buyerSkuCode = $price?->digiflazz_code ?: $price?->code;

            if (!$price || !$buyerSkuCode) {
                Log::error('Kode Digiflazz tidak ditemukan', [
                    'transaction_id' => $transaction->id,
                    'price_id' => $transaction->price_id,
                ]);

                return response()->json(['success' => true]);
            }

            if (!$transaction->digiflazz_customer_no) {
                Log::error('Digiflazz customer no kosong', [
                    'transaction_id' => $transaction->id,
                    'merchant_ref' => $transaction->merchant_ref,
                ]);

                return response()->json(['success' => true]);
            }

            Log::info('MASUK DIGIFLAZZ', [
                'buyer_sku_code' => $buyerSkuCode,
                'customer_no' => $transaction->digiflazz_customer_no,
                'ref_id' => $transaction->merchant_ref,
            ]);

            $digiflazz = app(DigiflazzService::class);

            $result = $digiflazz->createTransaction([
                'buyer_sku_code' => $buyerSkuCode,
                'customer_no' => $transaction->digiflazz_customer_no,
                'ref_id' => $transaction->merchant_ref,
            ]);

            Log::info('RESULT DIGIFLAZZ', $result);

            $transaction->update([
                'digiflazz_status' => data_get($result, 'data.status'),
                'digiflazz_sn' => data_get($result, 'data.sn'),
                'digiflazz_response' => $result,
                'digiflazz_processed_at' => now(),
            ]);

            $transaction->refresh();

            broadcast(new DigiflazzStatusUpdated(
                reference: (string) $transaction->reference,
                merchantRef: (string) $transaction->merchant_ref,
                digiflazzStatus: $transaction->digiflazz_status,
                digiflazzSn: $transaction->digiflazz_sn,
            ));
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
            'product_id' => 'required|integer',
            'price_id' => 'required|integer',
            'quantity' => 'required|integer|min:1',
            'payment_code' => 'required|string',
            'phone_number' => 'required|string',
            'customer_inputs' => 'required|array',
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

        $price = ProductPrice::findOrFail($validated['price_id']);
        $product = Product::findOrFail($validated['product_id']);

        $customerInputs = $validated['customer_inputs'];

        $template = $product->customer_no_template ?? '{customer_no}';

        $digiflazzCustomerNo = preg_replace_callback(
            '/\{(.+?)\}/',
            fn($matches) => $customerInputs[$matches[1]] ?? '',
            $template
        );

        if (trim($digiflazzCustomerNo) === '') {
            return response()->json([
                'message' => 'Data tujuan tidak valid.',
            ], 422);
        }

        $merchantRef = 'ORDER-' . time() . '-' . ($request->user()?->id ?? 'guest');
        $amount = (int) ($price->price * $validated['quantity']);

        $result = $this->tripay->createTransaction([
            'method' => $normalizedPaymentCode,
            'merchant_ref' => $merchantRef,
            'amount' => $amount,
            'customer_name' => $request->user()?->name ?? 'Customer',
            'customer_email' => $request->user()?->email ?? 'customer@email.com',
            'customer_phone' => $validated['phone_number'],
            'order_items' => [
                [
                    'name' => $price->display_name,
                    'price' => (int) $price->price,
                    'quantity' => $validated['quantity'],
                ],
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

                // Nomor WhatsApp / kontak user
                'customer_phone' => $validated['phone_number'],

                // Data input asli dari user
                'customer_inputs' => $customerInputs,

                // Format final yang dikirim ke Digiflazz
                'digiflazz_customer_no' => $digiflazzCustomerNo,

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


    public function digiflazzCallback(Request $request)
    {
        // ✅ 1. LOG MASUK
        Log::info('DIGIFLAZZ CALLBACK MASUK', $request->all());

        // ✅ 2. VALIDASI SIGNATURE (TARUH DI SINI)
        $signature = $request->header('X-Hub-Signature');

        $expected = md5(
            config('services.digiflazz.username') .
                config('services.digiflazz.api_key')
        );

        if ($signature !== $expected) {
            Log::error('Signature Digiflazz tidak valid', [
                'received' => $signature,
                'expected' => $expected,
            ]);

            return response()->json(['message' => 'Invalid signature'], 403);
        }

        // ✅ 3. BARU PROSES DATA
        $data = $request->all();

        $refId = data_get($data, 'data.ref_id');

        if (!$refId) {
            return response()->json(['message' => 'Invalid ref_id'], 400);
        }

        $transaction = Transaction::where('merchant_ref', $refId)->first();

        if (!$transaction) {
            Log::error('Transaksi tidak ditemukan', [
                'ref_id' => $refId,
            ]);

            return response()->json(['success' => false]);
        }

        // update data
        $transaction->update([
            'digiflazz_status' => data_get($data, 'data.status'),
            'digiflazz_sn' => data_get($data, 'data.sn'),
            'digiflazz_response' => $data,
        ]);

        return response()->json(['success' => true]);
    }
}
