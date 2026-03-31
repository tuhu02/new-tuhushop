<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductInstruction extends Model
{
    protected $fillable = [
        'product_id',
        'title',
        'content'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
