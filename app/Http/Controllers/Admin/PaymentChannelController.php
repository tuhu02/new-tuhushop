<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePaymentChannelRequest;
use App\Http\Requests\Admin\UpdatePaymentChannelRequest;
use App\Models\PaymentChannel;
use App\Models\PaymentMethod;
use App\Services\TripayService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Throwable;
use Inertia\Inertia;
use Inertia\Response;

class PaymentChannelController extends Controller
{
    /**
     * Display a listing of payment channels.
     */
    public function index(): Response
    {
        $paymentChannels = PaymentChannel::query()
            ->with('paymentMethod:id,name,code')
            ->latest()
            ->get()
            ->map(function (PaymentChannel $paymentChannel): array {
                return [
                    'id' => $paymentChannel->id,
                    'payment_method_id' => $paymentChannel->payment_method_id,
                    'name' => $paymentChannel->name,
                    'code' => $paymentChannel->code,
                    'logo' => $paymentChannel->logo,
                    'logo_url' => asset('storage/' . $paymentChannel->logo),
                    'fee' => $paymentChannel->fee,
                    'fee_percent' => $paymentChannel->fee_percent,
                    'min_amount' => $paymentChannel->min_amount,
                    'max_amount' => $paymentChannel->max_amount,
                    'instructions' => $paymentChannel->instructions,
                    'is_active' => $paymentChannel->is_active,
                    'payment_method' => $paymentChannel->paymentMethod,
                ];
            });

        return Inertia::render('admin/payment-channels/index', [
            'paymentChannels' => $paymentChannels,
        ]);
    }

    /**
     * Show the form for creating a new payment channel.
     */
    public function create(): Response
    {
        return Inertia::render('admin/payment-channels/create', [
            'paymentMethods' => PaymentMethod::query()
                ->select('id', 'name', 'code')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Sync payment channels from Tripay API.
     */
    public function syncTripay(TripayService $tripay): RedirectResponse
    {
        try {
            $result = $tripay->syncPaymentChannels();

            return back()->with(
                'success',
                "Sinkronisasi Tripay selesai. {$result['created']} channel baru, {$result['updated']} channel diperbarui, {$result['skipped']} dilewati.",
            );
        } catch (Throwable $exception) {
            report($exception);

            return back()->with('error', 'Sinkronisasi Tripay gagal: ' . $exception->getMessage());
        }
    }

    /**
     * Store a newly created payment channel in storage.
     */
    public function store(StorePaymentChannelRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $logoPath = $request->file('logo')->store('payment-channels', 'public');

        PaymentChannel::query()->create([
            ...$validated,
            'logo' => $logoPath,
        ]);

        return to_route('admin.payment-channels.index');
    }

    /**
     * Show the form for editing the specified payment channel.
     */
    public function edit(PaymentChannel $payment_channel): Response
    {
        return Inertia::render('admin/payment-channels/edit', [
            'paymentChannel' => [
                'id' => $payment_channel->id,
                'payment_method_id' => $payment_channel->payment_method_id,
                'name' => $payment_channel->name,
                'code' => $payment_channel->code,
                'logo' => $payment_channel->logo,
                'logo_url' => asset('storage/' . $payment_channel->logo),
                'fee' => $payment_channel->fee,
                'fee_percent' => $payment_channel->fee_percent,
                'min_amount' => $payment_channel->min_amount,
                'max_amount' => $payment_channel->max_amount,
                'instructions' => $payment_channel->instructions,
                'is_active' => $payment_channel->is_active,
                'payment_method' => $payment_channel->paymentMethod,
            ],
            'paymentMethods' => PaymentMethod::query()
                ->select('id', 'name', 'code')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Update the specified payment channel in storage.
     */
    public function update(
        UpdatePaymentChannelRequest $request,
        PaymentChannel $payment_channel,
    ): RedirectResponse {
        $validated = $request->validated();

        $payload = [
            ...$validated,
            'logo' => $payment_channel->logo,
        ];

        if ($request->hasUploadedLogo()) {
            Storage::disk('public')->delete($payment_channel->logo);
            $payload['logo'] = $request->file('logo')->store('payment-channels', 'public');
        }

        $payment_channel->update($payload);

        return to_route('admin.payment-channels.index');
    }

    /**
     * Remove the specified payment channel from storage.
     */
    public function destroy(PaymentChannel $payment_channel): RedirectResponse
    {
        Storage::disk('public')->delete($payment_channel->logo);
        $payment_channel->delete();

        return back();
    }
}
