<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('reference')->nullable()->unique()->after('id');
            $table->string('merchant_ref')->nullable()->unique()->after('reference');
            $table->foreignId('payment_channel_id')->nullable()->constrained('payment_channels')->nullOnDelete()->after('merchant_ref');
            $table->string('payment_channel_code')->nullable()->after('payment_channel_id');
            $table->string('payment_channel_name')->nullable()->after('payment_channel_code');
            $table->string('payment_method_code')->nullable()->after('payment_channel_name');
            $table->string('payment_method_name')->nullable()->after('payment_method_code');
            $table->string('customer_name')->nullable()->after('payment_method_name');
            $table->string('customer_email')->nullable()->after('customer_name');
            $table->string('customer_phone')->nullable()->after('customer_email');
            $table->unsignedBigInteger('product_id')->nullable()->after('customer_phone');
            $table->unsignedBigInteger('price_id')->nullable()->after('product_id');
            $table->unsignedInteger('quantity')->default(1)->after('price_id');
            $table->unsignedBigInteger('amount')->default(0)->after('quantity');
            $table->unsignedBigInteger('fee_merchant')->nullable()->after('amount');
            $table->unsignedBigInteger('fee_customer')->nullable()->after('fee_merchant');
            $table->unsignedBigInteger('amount_received')->nullable()->after('fee_customer');
            $table->string('pay_code')->nullable()->after('amount_received');
            $table->text('pay_url')->nullable()->after('pay_code');
            $table->text('checkout_url')->nullable()->after('pay_url');
            $table->string('status')->default('UNPAID')->after('checkout_url');
            $table->timestamp('expired_at')->nullable()->after('status');
            $table->json('instructions')->nullable()->after('expired_at');
            $table->json('raw_response')->nullable()->after('instructions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('payment_channel_id');
            $table->dropColumn([
                'reference',
                'merchant_ref',
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
            ]);
        });
    }
};
