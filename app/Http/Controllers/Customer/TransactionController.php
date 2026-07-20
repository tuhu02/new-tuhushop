<?php

namespace App\Http\Controllers\Customer;

use App\Events\TransactionStatusUpdated;
use App\Http\Controllers\Controller;
use App\Mail\TransactionInvoiceMail;
use App\Models\PaymentChannel;
use App\Models\Product;
use App\Models\ProductPrice;
use App\Models\Transaction;
use App\Services\DigiflazzService;
use App\Services\TripayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Events\DigiflazzStatusUpdated;

class TransactionController extends Controller
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
                try {
                    broadcast(new TransactionStatusUpdated(
                        reference: (string) $transaction->reference,
                        status: (string) $transaction->status,
                        merchantRef: (string) $transaction->merchant_ref,
                    ));
                } catch (\Throwable $e) {
                    Log::warning('Websocket broadcast failed: ' . $e->getMessage());
                }
            }

            $status = strtoupper((string) ($data['status'] ?? ''));

            if (in_array($status, ['EXPIRED', 'FAILED', 'REFUND'], true)) {
                Log::info('TRANSAKSI TIDAK DIBAYAR / GAGAL', [
                    'transaction_id' => $transaction->id,
                    'reference' => $transaction->reference,
                    'merchant_ref' => $transaction->merchant_ref,
                    'status' => $transaction->status,
                ]);

                return response()->json(['success' => true]);
            }
        }

        if (($data['status'] ?? null) === 'PAID' && $transaction !== null) {
            Log::info('STATUS PAID MASUK');

            if (
                $transaction->digiflazz_processed_at !== null ||
                $transaction->digiflazz_status === 'Sukses'
            ) {
                return response()->json(['success' => true]);
            }

            // Send invoice email
            $this->sendInvoiceEmail($transaction);

            $product = Product::query()->find((int) $transaction->product_id);

            if ($product?->fulfillment_type === 'manual') {
                Log::info('Produk manual, tidak dikirim ke Digiflazz', [
                    'transaction_id' => $transaction->id,
                    'merchant_ref' => $transaction->merchant_ref,
                    'product_id' => $transaction->product_id,
                ]);

                return response()->json(['success' => true]);
            }

            $price = ProductPrice::query()->find((int) $transaction->price_id);
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

            try {
                broadcast(new TransactionStatusUpdated(
                    reference: (string) $transaction->reference,
                    status: (string) $transaction->status,
                    merchantRef: (string) $transaction->merchant_ref,
                ));
            } catch (\Throwable $e) {
                Log::warning('Websocket broadcast failed: ' . $e->getMessage());
            }
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
            'digiflazz_status' => $transaction->digiflazz_status,
            'digiflazz_sn' => $transaction->digiflazz_sn,
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
            ->whereRaw('UPPER(code) = ?', [$normalizedPaymentCode], 'and')
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
                // Untuk QRIS, pay_url null tapi ada qr_url
                'pay_url' => $tripayData['pay_url'] ?? $tripayData['qr_url'] ?? null,
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
                'pay_url' => $transaction->pay_url
                    ?? $transaction->checkout_url
                    ?? data_get($transaction->raw_response, 'pay_url')
                    ?? data_get($transaction->raw_response, 'checkout_url')
                    ?? data_get($transaction->raw_response, 'payment_url')
                    ?? data_get($transaction->raw_response, 'deeplink_url')
                    ?? data_get($transaction->raw_response, 'qr_url')
                    ?? null,
                'qr_string' => data_get($transaction->raw_response, 'qr_string'),
                'status' => $transaction->status,
                'digiflazz_status' => $transaction->digiflazz_status,
                'digiflazz_sn' => $transaction->digiflazz_sn,
                'expired_at' => optional($transaction->expired_at)?->toIso8601String(),
                'instructions' => $transaction->instructions ?? [],
            ],
        ]);
    }


    public function digiflazzCallback(Request $request)
    {
        Log::info('DIGIFLAZZ CALLBACK MASUK', $request->all());

        $signature = $request->header('X-Hub-Signature');

        $rawBody = $request->getContent();
        $secret = config('services.digiflazz.webhook_secret');
        $computed = hash_hmac('sha1', $rawBody, (string) $secret);
        
        $expectedWithPrefix = 'sha1=' . $computed;

        if (!hash_equals($expectedWithPrefix, (string) $signature) && !hash_equals($computed, (string) $signature)) {
            Log::error('Signature Digiflazz tidak valid', [
                'received' => $signature,
                'expected_with_prefix' => $expectedWithPrefix,
                'expected_raw' => $computed,
            ]);

            return response()->json(['message' => 'Invalid signature'], 403);
        }

        $data = $request->all();

        $refId = data_get($data, 'data.ref_id');

        if (!$refId) {
            return response()->json(['message' => 'Invalid ref_id'], 400);
        }

        $transaction = Transaction::query()->where('merchant_ref', '=', $refId)->first();

        if (!$transaction) {
            Log::error('Transaksi tidak ditemukan', [
                'ref_id' => $refId,
            ]);

            return response()->json(['success' => false]);
        }

        $previousDigiflazzStatus = $transaction->digiflazz_status;
        
        $transaction->update([
            'digiflazz_status' => data_get($data, 'data.status'),
            'digiflazz_sn' => data_get($data, 'data.sn'),
            'digiflazz_response' => $data,
        ]);

        if ($previousDigiflazzStatus !== 'Sukses' && $transaction->digiflazz_status === 'Sukses') {
            $this->sendInvoiceEmail($transaction);
        }

        try {
            broadcast(new DigiflazzStatusUpdated(
                reference: (string) $transaction->reference,
                merchantRef: (string) $transaction->merchant_ref,
                digiflazzStatus: $transaction->digiflazz_status,
                digiflazzSn: $transaction->digiflazz_sn,
            ));
        } catch (\Throwable $e) {
            Log::warning('Websocket broadcast failed: ' . $e->getMessage());
        }

        return response()->json(['success' => true]);
    }

    /**
     * Send invoice email to customer
     */
    private function sendInvoiceEmail(Transaction $transaction): void
    {
        $email = $transaction->customer_email;

        if (
            !$email ||
            !filter_var($email, FILTER_VALIDATE_EMAIL) ||
            in_array(strtolower($email), ['customer@email.com', 'guest@email.com'], true)
        ) {
            Log::info('Invoice email skipped: guest/no valid email', [
                'transaction_id' => $transaction->id,
                'merchant_ref' => $transaction->merchant_ref,
                'customer_email' => $email,
            ]);

            return;
        }

        try {
            Mail::to($email)
                ->queue(new TransactionInvoiceMail($transaction));

            Log::info('Invoice email queued', [
                'transaction_id' => $transaction->id,
                'merchant_ref' => $transaction->merchant_ref,
                'customer_email' => $email,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send invoice email', [
                'transaction_id' => $transaction->id,
                'merchant_ref' => $transaction->merchant_ref,
                'customer_email' => $email,
                'error' => $e->getMessage(),
            ]);
        }
    }
}