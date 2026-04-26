<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // untuk menyimpan field input (JSON)
            $table->json('input_fields')->nullable()->after('is_active');

            // untuk template Digiflazz
            $table->string('customer_no_template')->nullable()->after('input_fields');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'input_fields',
                'customer_no_template',
            ]);
        });
    }
};
