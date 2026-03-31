<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentChannelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare data before validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'min_amount' => $this->input('min_amount') === '' ? null : $this->input('min_amount'),
            'max_amount' => $this->input('max_amount') === '' ? null : $this->input('max_amount'),
        ]);
    }

    /**
     * Determine if the user uploaded a file.
     */
    public function hasUploadedLogo(): bool
    {
        return $this->hasFile('logo');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'payment_method_id' => ['required', 'exists:payment_methods,id'],
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:100', 'alpha_dash', 'unique:payment_channels,code'],
            'logo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'fee' => ['required', 'integer', 'min:0'],
            'min_amount' => ['nullable', 'integer', 'min:0'],
            'max_amount' => ['nullable', 'integer', 'min:0', 'gte:min_amount'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
