<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePaymentChannelRequest;
use App\Http\Requests\Admin\UpdatePaymentChannelRequest;
use App\Models\PaymentChannel;
use App\Models\PaymentMethod;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PaymentChannelController extends Controller
{
    /**
     * Display a listing of payment channels.
     */
    public function index(): Response
    {
        return Inertia::render('admin/payment-channels/index', [
            'paymentChannels' => PaymentChannel::query()
                ->with('paymentMethod:id,name,code')
                ->latest()
                ->get(),
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
     * Store a newly created payment channel in storage.
     */
    public function store(StorePaymentChannelRequest $request): RedirectResponse
    {
        PaymentChannel::query()->create($request->validated());

        return to_route('admin.payment-channels.index');
    }

    /**
     * Show the form for editing the specified payment channel.
     */
    public function edit(PaymentChannel $payment_channel): Response
    {
        return Inertia::render('admin/payment-channels/edit', [
            'paymentChannel' => $payment_channel->load('paymentMethod:id,name,code'),
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
        $payment_channel->update($request->validated());

        return to_route('admin.payment-channels.index');
    }

    /**
     * Remove the specified payment channel from storage.
     */
    public function destroy(PaymentChannel $payment_channel): RedirectResponse
    {
        $payment_channel->delete();

        return back();
    }
}
