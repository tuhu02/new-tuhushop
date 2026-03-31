<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePaymentMethodRequest;
use App\Http\Requests\Admin\UpdatePaymentMethodRequest;
use App\Models\PaymentMethod;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PaymentMethodController extends Controller
{
    /**
     * Display a listing of payment methods.
     */
    public function index(): Response
    {
        return Inertia::render('admin/payment-methods/index', [
            'paymentMethods' => PaymentMethod::query()
                ->withCount('channels')
                ->latest()
                ->get(),
        ]);
    }

    /**
     * Show the form for creating a new payment method.
     */
    public function create(): Response
    {
        return Inertia::render('admin/payment-methods/create');
    }

    /**
     * Store a newly created payment method in storage.
     */
    public function store(StorePaymentMethodRequest $request): RedirectResponse
    {
        PaymentMethod::query()->create($request->validated());

        return to_route('admin.payment-methods.index');
    }

    /**
     * Show the form for editing the specified payment method.
     */
    public function edit(PaymentMethod $payment_method): Response
    {
        return Inertia::render('admin/payment-methods/edit', [
            'paymentMethod' => $payment_method,
        ]);
    }

    /**
     * Update the specified payment method in storage.
     */
    public function update(
        UpdatePaymentMethodRequest $request,
        PaymentMethod $payment_method,
    ): RedirectResponse {
        $payment_method->update($request->validated());

        return to_route('admin.payment-methods.index');
    }

    /**
     * Remove the specified payment method from storage.
     */
    public function destroy(PaymentMethod $payment_method): RedirectResponse
    {
        if ($payment_method->channels()->exists()) {
            return back()->with('error', 'Payment method tidak bisa dihapus karena masih memiliki channel.');
        }

        $payment_method->delete();

        return back();
    }
}
