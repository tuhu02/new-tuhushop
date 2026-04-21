<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\PaymentChannel;
use App\Models\Product;
use App\Models\PaymentMethod;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->with([
                'brand',
                'categories:id,name',
                'instructions',
                'prices' => function ($query) {
                    $query->with('category')->orderBy('price_list_category_id')->orderBy('order');
                }
            ])
            ->firstOrFail();

        $pricesByCategory = $product->prices->groupBy('price_list_category_id')->map(function ($prices) {
            return [
                'category' => $prices->first()->category,
                'prices' => $prices->values(),
            ];
        })->values();

        $paymentMethods = PaymentMethod::where('is_active', true)->with('channels')
            ->get()
            ->map(function (PaymentMethod $method) {
                return [
                    'id' => $method->id,
                    'name' => $method->name,
                    'code' => $method->code,
                    'logo' => $method->logo,
                    'logo_url' => $method->logo ? asset('storage/' . $method->logo) : null,
                    'is_active' => $method->is_active,

                    'channels' => $method->channels->map(function ($channel) {
                        return [
                            'id' => $channel->id,
                            'name' => $channel->name,
                            'code' => $channel->code,
                            'logo' => $channel->logo,
                            'logo_url' => $channel->logo ? asset('storage/' . $channel->logo) : null,
                            'fee' => $channel->fee,
                            'fee_percent' => $channel->fee_percent,
                            'min_amount' => $channel->min_amount,
                            'max_amount' => $channel->max_amount,
                            'instructions' => $channel->instructions,
                        ];
                    }),
                ];
            });


        $user = Auth::user();

        return Inertia::render('customer/product-show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'brand' => $product->brand?->name,
                'categories' => $product->categories->pluck('name')->values(),
                'thumbnail' => $product->thumbnail,
                'thumbnail_url' => $product->thumbnail !== null
                    ? asset('storage/' . $product->thumbnail)
                    : null,
                'banner' => $product->banner,
                'banner_url' => $product->banner !== null
                    ? asset('storage/' . $product->banner)
                    : null,
                'instructions' => $product->instructions->map(function ($instruction) {
                    return [
                        'title' => $instruction->title,
                        'content' => $instruction->content,
                    ];
                })->values(),
            ],

            'pricesByCategory' => $pricesByCategory,
            'paymentMethods' => $paymentMethods,
            'user' => $user,
        ]);
    }
}
