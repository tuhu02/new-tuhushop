<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Icon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class IconController extends Controller
{
    public function index()
    {
        $icons = Icon::latest()->get();
        return Inertia::render('admin/icons/index', [
            'icons' => $icons
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'name' => 'nullable|string|max:255'
        ]);

        $file = $request->file('image');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('icons', $filename, 'public');

        Icon::create([
            'name' => $request->name ?: pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'file_path' => '/storage/' . $path
        ]);

        return redirect()->back()->with('success', 'Icon berhasil diupload');
    }

    public function destroy(Icon $icon)
    {
        // Delete file if exists
        $path = str_replace('/storage/', '', $icon->file_path);
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        $icon->delete();

        return redirect()->back()->with('success', 'Icon berhasil dihapus');
    }
}
