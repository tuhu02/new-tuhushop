<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'price',
        'description',
        'brand_id',
        'thumbnail',
        'banner',
        'is_active',
        'digiflazz_code',
        'digiflazz_synced_at',
        'input_fields',
        'customer_no_template',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'brand_id' => 'integer',
            'is_active' => 'boolean',
            'price' => 'decimal:2',
            'digiflazz_synced_at' => 'datetime',
            'input_fields' => 'array',
        ];
    }

    /**
     * Get brand that owns this product.
     */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Categories linked to this product.
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    /**
     * Get all prices for this product
     */
    public function prices(): HasMany
    {
        return $this->hasMany(ProductPrice::class)->where('is_active', true)->orderBy('order');
    }

    public function instructions(): HasMany
    {
        return $this->hasMany(ProductInstruction::class);
    }
}
