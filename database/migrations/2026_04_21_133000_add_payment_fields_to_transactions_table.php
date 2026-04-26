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
            Schema::table('transactions', function (Blueprint $table) {
                // Kode transaksi dari payment gateway, biasanya untuk tracking pembayaran
                $table->string('reference')->nullable()->unique()->after('id');

                // Kode transaksi dari sistem kita sendiri, dikirim ke payment gateway
                $table->string('merchant_ref')->nullable()->unique()->after('reference');

                // Relasi ke tabel payment_channels, misalnya VA BCA, QRIS, e-wallet, dll
                $table->foreignId('payment_channel_id')
                    ->nullable()
                    ->constrained('payment_channels')
                    ->nullOnDelete()
                    ->after('merchant_ref');

                // Kode channel pembayaran, contoh: BCA, BRI, QRIS
                $table->string('payment_channel_code')->nullable()->after('payment_channel_id');

                // Nama channel pembayaran, contoh: BCA Virtual Account
                $table->string('payment_channel_name')->nullable()->after('payment_channel_code');

                // Kode metode pembayaran, contoh: BANK_TRANSFER, QRIS, EWALLET
                $table->string('payment_method_code')->nullable()->after('payment_channel_name');

                // Nama metode pembayaran, contoh: Bank Transfer, QRIS, E-Wallet
                $table->string('payment_method_name')->nullable()->after('payment_method_code');

                // Nama pelanggan yang melakukan transaksi
                $table->string('customer_name')->nullable()->after('payment_method_name');

                // Email pelanggan
                $table->string('customer_email')->nullable()->after('customer_name');

                // Nomor HP pelanggan
                $table->string('customer_phone')->nullable()->after('customer_email');

                // ID produk yang dibeli
                $table->unsignedBigInteger('product_id')->nullable()->after('customer_phone');

                // ID harga/varian harga produk
                $table->unsignedBigInteger('price_id')->nullable()->after('product_id');

                // Jumlah produk yang dibeli
                $table->unsignedInteger('quantity')->default(1)->after('price_id');

                // Total nominal transaksi sebelum biaya admin
                $table->unsignedBigInteger('amount')->default(0)->after('quantity');

                // Biaya admin yang ditanggung merchant/toko
                $table->unsignedBigInteger('fee_merchant')->nullable()->after('amount');

                // Biaya admin yang ditanggung customer
                $table->unsignedBigInteger('fee_customer')->nullable()->after('fee_merchant');

                // Nominal bersih yang diterima merchant setelah dipotong fee
                $table->unsignedBigInteger('amount_received')->nullable()->after('fee_customer');

                // Kode pembayaran, contoh nomor Virtual Account atau kode bayar retail
                $table->string('pay_code')->nullable()->after('amount_received');

                // URL pembayaran langsung dari payment gateway
                $table->text('pay_url')->nullable()->after('pay_code');

                // URL halaman checkout payment gateway
                $table->text('checkout_url')->nullable()->after('pay_url');

                // Status transaksi, contoh: UNPAID, PAID, EXPIRED, FAILED
                $table->string('status')->default('UNPAID')->after('checkout_url');

                // Batas waktu pembayaran
                $table->timestamp('expired_at')->nullable()->after('status');

                // Instruksi pembayaran dari payment gateway, biasanya array/json
                $table->json('instructions')->nullable()->after('expired_at');

                // Response asli dari payment gateway untuk kebutuhan debugging/log
                $table->json('raw_response')->nullable()->after('instructions');
            });
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
