<?php

namespace App\Http\Requests\Admin;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
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
        /** @var Category $category */
        $category = $this->route('category');
        $name = trim((string) $this->input('name', ''));

        if ($name === '') {
            return;
        }

        if ($name === $category->name) {
            $this->merge([
                'slug' => $category->slug,
            ]);

            return;
        }

        $baseSlug = Str::slug($name);
        $slug = $baseSlug !== '' ? $baseSlug : 'category';
        $counter = 1;

        while (Category::query()
            ->where('slug', $slug)
            ->where('id', '!=', $category->id)
            ->exists()) {
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
        /** @var Category $category */
        $category = $this->route('category');

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('categories', 'slug')->ignore($category->id),
            ],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
