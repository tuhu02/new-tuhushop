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
        if (! Schema::hasTable('products')) {
            return;
        }

        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'price')) {
                $table->dropColumn('price');
            }

            if (Schema::hasColumn('products', 'stock')) {
                $table->dropColumn('stock');
            }

            if (Schema::hasColumn('products', 'description')) {
                $table->dropColumn('description');
            }

            if (! Schema::hasColumn('products', 'brand_id')) {
                $table->unsignedBigInteger('brand_id')->default(1)->after('slug');
                $table->index('brand_id');
            }

            if (! Schema::hasColumn('products', 'thumbnail')) {
                $table->string('thumbnail')->nullable()->after('brand_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('products')) {
            return;
        }

        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'thumbnail')) {
                $table->dropColumn('thumbnail');
            }

            if (Schema::hasColumn('products', 'brand_id')) {
                $table->dropIndex(['brand_id']);
                $table->dropColumn('brand_id');
            }

            if (! Schema::hasColumn('products', 'price')) {
                $table->decimal('price', 12, 2)->default(0);
            }

            if (! Schema::hasColumn('products', 'stock')) {
                $table->unsignedInteger('stock')->default(0);
            }

            if (! Schema::hasColumn('products', 'description')) {
                $table->text('description')->nullable();
            }
        });
    }
};
