<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePaymentMethodRequest;
use App\Http\Requests\Admin\UpdatePaymentMethodRequest;
use App\Models\PaymentMethod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
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
                ->get()
                ->map(function (PaymentMethod $method): array {
                    return [
                        'id' => $method->id,
                        'name' => $method->name,
                        'code' => $method->code,
                        'logo' => $method->logo,
                        'logo_url' => $method->logo ? asset('storage/' . $method->logo) : null,
                        'is_active' => $method->is_active,
                        'channels_count' => $method->channels_count ?? 0,
                    ];
                }),
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
        $validated = $request->validated();
        $logoPath = $request->file('logo')->store('payment-methods', 'public');

        PaymentMethod::query()->create([
            ...$validated,
            'logo' => $logoPath,
        ]);

        return to_route('admin.payment-methods.index');
    }

    /**
     * Show the form for editing the specified payment method.
     */
    public function edit(PaymentMethod $payment_method): Response
    {
        return Inertia::render('admin/payment-methods/edit', [
            'paymentMethod' => [
                'id' => $payment_method->id,
                'name' => $payment_method->name,
                'code' => $payment_method->code,
                'logo' => $payment_method->logo,
                'logo_url' => $payment_method->logo ? asset('storage/' . $payment_method->logo) : null,
                'is_active' => $payment_method->is_active,
            ],
        ]);
    }

    /**
     * Update the specified payment method in storage.
     */
    public function update(
        UpdatePaymentMethodRequest $request,
        PaymentMethod $payment_method,
    ): RedirectResponse {
        $validated = $request->validated();

        if ($request->hasFile('logo')) {
            if ($payment_method->logo) {
                Storage::disk('public')->delete($payment_method->logo);
            }
            $logoPath = $request->file('logo')->store('payment-methods', 'public');
            $validated['logo'] = $logoPath;
        }

        $payment_method->update($validated);

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

        if ($payment_method->logo) {
            Storage::disk('public')->delete($payment_method->logo);
        }

        $payment_method->delete();

        return back();
    }
}
