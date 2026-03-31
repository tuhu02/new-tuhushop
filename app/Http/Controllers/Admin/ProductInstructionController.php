<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductInstructionRequest;
use App\Http\Requests\Admin\UpdateProductInstructionRequest;
use App\Models\Product;
use App\Models\ProductInstruction;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductInstructionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('admin/product-instruction/index', [
            'instructions' => ProductInstruction::query()
                ->with('product:id,name')
                ->latest()
                ->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/product-instruction/create', [
            'products' => Product::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductInstructionRequest $request): RedirectResponse
    {
        ProductInstruction::query()->create($request->validated());

        return to_route('admin.product-instructions.index')
            ->with('success', 'Instruksi produk berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function edit(ProductInstruction $productInstruction): Response
    {
        return Inertia::render('admin/product-instruction/edit', [
            'instruction' => $productInstruction->load('product:id,name'),
            'products' => Product::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateProductInstructionRequest $request,
        ProductInstruction $productInstruction,
    ): RedirectResponse {
        $productInstruction->update($request->validated());

        return to_route('admin.product-instructions.index')
            ->with('success', 'Instruksi produk berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductInstruction $productInstruction): RedirectResponse
    {
        $productInstruction->delete();

        return back()->with('success', 'Instruksi produk berhasil dihapus.');
    }
}
