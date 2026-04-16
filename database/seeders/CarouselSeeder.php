<?php

namespace Database\Seeders;

use App\Models\Carousel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CarouselSeeder extends Seeder
{
    /**
     * Seed carousel items from files stored in public/carousel.
     */
    public function run(): void
    {
        $sourceDirectory = public_path('carousel');

        if (! File::exists($sourceDirectory)) {
            return;
        }

        $files = collect(File::files($sourceDirectory))
            ->sortBy(fn($file): string => $file->getFilename())
            ->values();

        foreach ($files as $index => $file) {
            $originalName = $file->getFilename();
            $extension = strtolower($file->getExtension());
            $fileName = Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '.' . $extension;
            $storagePath = 'carousels/' . $fileName;

            Storage::disk('public')->put($storagePath, File::get($file->getPathname()));

            Carousel::query()->updateOrCreate(
                ['image_path' => $storagePath],
                [
                    'title' => Str::headline(pathinfo($originalName, PATHINFO_FILENAME)),
                    'sort_order' => $index,
                    'is_active' => true,
                ],
            );
        }
    }
}
