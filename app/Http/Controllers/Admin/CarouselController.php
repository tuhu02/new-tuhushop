<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCarouselRequest;
use App\Http\Requests\Admin\UpdateCarouselRequest;
use App\Models\Carousel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CarouselController extends Controller
{
    /**
     * Display a listing of carousels.
     */
    public function index(): Response
    {
        $carousels = Carousel::query()
            ->orderBy('sort_order')
            ->latest('id')
            ->get()
            ->map(function (Carousel $carousel): array {
                return [
                    'id' => $carousel->id,
                    'title' => $carousel->title,
                    'image_path' => $carousel->image_path,
                    'image_url' => asset('storage/' . $carousel->image_path),
                    'sort_order' => $carousel->sort_order,
                    'is_active' => $carousel->is_active,
                ];
            });

        return Inertia::render('admin/carousels/index', [
            'carousels' => $carousels,
        ]);
    }

    /**
     * Show the form for creating a new carousel.
     */
    public function create(): Response
    {
        return Inertia::render('admin/carousels/create');
    }

    /**
     * Store a newly created carousel in storage.
     */
    public function store(StoreCarouselRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $imagePath = $request->file('image')->store('carousels', 'public');

        Carousel::query()->create([
            'title' => $validated['title'] ?? null,
            'image_path' => $imagePath,
            'sort_order' => $validated['sort_order'],
            'is_active' => $validated['is_active'],
        ]);

        return to_route('admin.carousels.index');
    }

    /**
     * Show the form for editing the specified carousel.
     */
    public function edit(Carousel $carousel): Response
    {
        return Inertia::render('admin/carousels/edit', [
            'carousel' => [
                'id' => $carousel->id,
                'title' => $carousel->title,
                'image_path' => $carousel->image_path,
                'image_url' => asset('storage/' . $carousel->image_path),
                'sort_order' => $carousel->sort_order,
                'is_active' => $carousel->is_active,
            ],
        ]);
    }

    /**
     * Update the specified carousel in storage.
     */
    public function update(UpdateCarouselRequest $request, Carousel $carousel): RedirectResponse
    {
        $validated = $request->validated();

        $payload = [
            'title' => $validated['title'] ?? null,
            'sort_order' => $validated['sort_order'],
            'is_active' => $validated['is_active'],
        ];

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($carousel->image_path);
            $payload['image_path'] = $request->file('image')->store('carousels', 'public');
        }

        $carousel->update($payload);

        return to_route('admin.carousels.index');
    }

    /**
     * Remove the specified carousel from storage.
     */
    public function destroy(Carousel $carousel): RedirectResponse
    {
        Storage::disk('public')->delete($carousel->image_path);
        $carousel->delete();

        return back();
    }
}
