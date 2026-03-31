<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductPrice;
use App\Models\PriceListCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductPriceController extends Controller
{
    /**
     * Display a listing of product prices for a specific product.
     */
    public function index(Product $product): Response
    {
        $product->load(['brand', 'prices.category']);
        return Inertia::render('admin/products/prices/index', [
            'product' => $product,
            'prices' => $product->prices()
                ->with('category')
                ->orderBy('price_list_category_id')
                ->orderBy('order')
                ->get(),
        ]);
    }

    /**
     * Show the form for creating a new product price.
     */
    public function create(Product $product): Response
    {
        return Inertia::render('admin/products/prices/create', [
            'product' => $product->load('brand'),
            'categories' => PriceListCategory::query()
                ->where('is_active', true)
                ->orderBy('order')
                ->select('id', 'name', 'slug')
                ->get(),
        ]);
    }

    /**
     * Store a newly created product price in storage.
     */
    public function store(Product $product, Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'price_list_category_id' => 'required|exists:price_list_categories,id',
            'display_name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:product_prices,code',
            'price' => 'required|numeric|min:0',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $product->prices()->create([
            ...$validated,
            'order' => $validated['order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()
            ->route('admin.products.prices.index', $product)
            ->with('success', 'Price list berhasil ditambahkan');
    }

    /**
     * Show the form for editing the specified product price.
     */
    public function edit(Product $product, ProductPrice $price): Response
    {
        // Verify the price belongs to this product
        if ($price->product_id !== $product->id) {
            abort(404);
        }

        return Inertia::render('admin/products/prices/edit', [
            'product' => $product->load('brand'),
            'price' => $price->load('category'),
            'categories' => PriceListCategory::query()
                ->where('is_active', true)
                ->orderBy('order')
                ->select('id', 'name', 'slug')
                ->get(),
        ]);
    }

    /**
     * Update the specified product price in storage.
     */
    public function update(Product $product, ProductPrice $price, Request $request): RedirectResponse
    {
        // Verify the price belongs to this product
        if ($price->product_id !== $product->id) {
            abort(404);
        }

        $validated = $request->validate([
            'price_list_category_id' => 'required|exists:price_list_categories,id',
            'display_name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:product_prices,code,' . $price->id,
            'price' => 'required|numeric|min:0',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $price->update([
            ...$validated,
            'order' => $validated['order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()
            ->route('admin.products.prices.index', $product)
            ->with('success', 'Price list berhasil diperbarui');
    }

    /**
     * Remove the specified product price from storage.
     */
    public function destroy(Product $product, ProductPrice $price): RedirectResponse
    {
        // Verify the price belongs to this product
        if ($price->product_id !== $product->id) {
            abort(404);
        }

        $price->delete();

        return redirect()
            ->route('admin.products.prices.index', $product)
            ->with('success', 'Price list berhasil dihapus');
    }
}
