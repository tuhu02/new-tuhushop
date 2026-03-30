<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(): Response
    {
        $products = Product::query()
            ->with(['brand:id,name', 'categories:id,name'])
            ->latest()
            ->get()
            ->map(function (Product $product): array {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'brand_id' => $product->brand_id,
                    'thumbnail' => $product->thumbnail,
                    'thumbnail_url' => $product->thumbnail !== null
                        ? asset('storage/' . $product->thumbnail)
                        : null,
                    'banner' => $product->banner,
                    'banner_url' => $product->banner !== null
                        ? asset('storage/' . $product->banner)
                        : null,
                    'is_active' => $product->is_active,
                    'brand' => $product->brand,
                    'categories' => $product->categories,
                ];
            });

        return Inertia::render('admin/products/index', [
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(): Response
    {
        return Inertia::render('admin/products/create', [
            'brands' => Brand::query()->select('id', 'name')->orderBy('name')->get(),
            'categories' => Category::query()->select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $slug = Str::slug($validated['name']);
        $count = Product::where('slug', 'LIKE', "{$slug}%")->count();
        $slug = $count ? "{$slug}-{$count}" : $slug;

        $payload = [
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'slug' => $slug,
            'is_active' => $validated['is_active'],
        ];

        if ($request->hasFile('thumbnail')) {
            $payload['thumbnail'] = $request->file('thumbnail')->store('products', 'public');
        }

        if ($request->hasFile('banner')) {
            $payload['banner'] = $request->file('banner')->store('products', 'public');
        }

        $product = Product::query()->create($payload);

        $product->categories()->sync($validated['category_ids'] ?? []);

        return to_route('admin.products.index');
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product): Response
    {
        $product->load(['brand:id,name', 'categories:id,name']);

        return Inertia::render('admin/products/edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'brand_id' => $product->brand_id,
                'thumbnail' => $product->thumbnail,
                'thumbnail_url' => $product->thumbnail !== null
                    ? asset('storage/' . $product->thumbnail)
                    : null,
                'banner' => $product->banner,
                'banner_url' => $product->banner !== null
                    ? asset('storage/' . $product->banner)
                    : null,
                'is_active' => $product->is_active,
                'brand' => $product->brand,
                'categories' => $product->categories,
            ],
            'brands' => Brand::query()->select('id', 'name')->orderBy('name')->get(),
            'categories' => Category::query()->select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $validated = $request->validated();

        $payload = [];

        foreach (['name', 'description', 'slug', 'brand_id', 'is_active'] as $field) {
            if (array_key_exists($field, $validated)) {
                $payload[$field] = $validated[$field];
            }
        }

        if ($request->hasFile('thumbnail')) {
            if ($product->thumbnail !== null) {
                Storage::disk('public')->delete($product->thumbnail);
            }

            $payload['thumbnail'] = $request->file('thumbnail')->store('products', 'public');
        }

        if ($request->hasFile('banner')) {
            if ($product->banner !== null) {
                Storage::disk('public')->delete($product->banner);
            }

            $payload['banner'] = $request->file('banner')->store('products', 'public');
        }

        if ($payload !== []) {
            $product->update($payload);
        }

        if (array_key_exists('category_ids', $validated)) {
            $product->categories()->sync($validated['category_ids']);
        }

        return to_route('admin.products.index');
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product): RedirectResponse
    {
        if ($product->thumbnail !== null) {
            Storage::disk('public')->delete($product->thumbnail);
        }

        if ($product->banner !== null) {
            Storage::disk('public')->delete($product->banner);
        }

        $product->delete();

        return back();
    }
}
