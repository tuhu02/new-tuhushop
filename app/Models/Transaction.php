<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'reference',
        'merchant_ref',
        'payment_channel_id',
        'payment_channel_code',
        'payment_channel_name',
        'payment_method_code',
        'payment_method_name',
        'customer_name',
        'customer_email',
        'customer_phone',
        'product_id',
        'price_id',
        'quantity',
        'amount',
        'fee_merchant',
        'fee_customer',
        'amount_received',
        'pay_code',
        'pay_url',
        'checkout_url',
        'status',
        'expired_at',
        'instructions',
        'raw_response',
        'digiflazz_status',
        'digiflazz_sn',
        'digiflazz_response',
        'digiflazz_processed_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'payment_channel_id' => 'integer',
            'product_id' => 'integer',
            'price_id' => 'integer',
            'quantity' => 'integer',
            'amount' => 'integer',
            'fee_merchant' => 'integer',
            'fee_customer' => 'integer',
            'amount_received' => 'integer',
            'expired_at' => 'datetime',
            'instructions' => 'array',
            'raw_response' => 'array',
            'instructions' => 'array',
            'digiflazz_response' => 'array',
            'expired_at' => 'datetime',
            'digiflazz_processed_at' => 'datetime',
        ];
    }

    public function paymentChannel(): BelongsTo
    {
        return $this->belongsTo(PaymentChannel::class);
    }
}
