<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StorePriceListCategoryRequest;
use App\Http\Requests\Admin\UpdatePriceListCategoryRequest;
use App\Models\PriceListCategory;
use Inertia\Inertia;
use Inertia\Response;

class PriceListCategoryController
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $categories = PriceListCategory::orderBy('order')
            ->paginate(15);

        return Inertia::render('admin/price-list-categories/index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/price-list-categories/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePriceListCategoryRequest $request)
    {
        $category = PriceListCategory::create($request->validated());

        return redirect()->route('admin.price-list-categories.index')
            ->with('success', 'Price List Category berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(PriceListCategory $priceListCategory): Response
    {
        return Inertia::render('admin/price-list-categories/show', [
            'category' => $priceListCategory->load('productPrices'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PriceListCategory $priceListCategory): Response
    {
        return Inertia::render('admin/price-list-categories/edit', [
            'category' => $priceListCategory,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePriceListCategoryRequest $request, PriceListCategory $priceListCategory)
    {
        $priceListCategory->update($request->validated());

        return redirect()->route('admin.price-list-categories.index')
            ->with('success', 'Price List Category berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PriceListCategory $priceListCategory)
    {
        // Check if category has product prices
        if ($priceListCategory->productPrices()->exists()) {
            return redirect()->back()
                ->with('error', 'Kategori ini memiliki price list. Hapus price list terlebih dahulu.');
        }

        $priceListCategory->delete();

        return redirect()->route('admin.price-list-categories.index')
            ->with('success', 'Price List Category berhasil dihapus');
    }
}
