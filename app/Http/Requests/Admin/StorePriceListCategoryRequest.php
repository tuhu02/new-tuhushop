<?php

namespace App\Http\Requests\Admin;

use App\Models\PriceListCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StorePriceListCategoryRequest extends FormRequest
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
        $name = trim((string) $this->input('name', ''));

        if ($name === '') {
            return;
        }

        $baseSlug = Str::slug($name);
        $slug = $baseSlug !== '' ? $baseSlug : 'category';
        $counter = 1;

        while (PriceListCategory::query()->where('slug', $slug)->exists()) {
            $slug = $baseSlug !== '' ? "{$baseSlug}-{$counter}" : "category-{$counter}";
            $counter++;
        }

        $this->merge([
            'slug' => $slug,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', 'unique:price_list_categories,slug'],
            'description' => ['nullable', 'string'],
            'order' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }
}
