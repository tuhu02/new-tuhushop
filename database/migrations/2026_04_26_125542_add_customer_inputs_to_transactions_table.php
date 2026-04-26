<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->json('customer_inputs')->nullable()->after('customer_phone');
            $table->string('digiflazz_customer_no')->nullable()->after('customer_inputs');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn([
                'customer_inputs',
                'digiflazz_customer_no',
            ]);
        });
    }
};
