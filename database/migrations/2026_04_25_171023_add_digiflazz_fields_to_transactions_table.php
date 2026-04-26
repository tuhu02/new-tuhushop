<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menambahkan kolom Digiflazz ke tabel transactions.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Status transaksi dari Digiflazz.
            // Contoh: PENDING, SUKSES, GAGAL
            $table->string('digiflazz_status')
                ->nullable()
                ->after('raw_response');

            // Serial number / token / kode hasil transaksi dari Digiflazz.
            // Biasanya dipakai untuk token PLN, voucher game, atau bukti sukses.
            $table->string('digiflazz_sn')
                ->nullable()
                ->after('digiflazz_status');

            // Menyimpan seluruh response asli dari Digiflazz.
            // Berguna untuk debugging jika transaksi gagal / pending.
            $table->json('digiflazz_response')
                ->nullable()
                ->after('digiflazz_sn');

            // Waktu terakhir transaksi dikirim ke Digiflazz.
            // Berguna untuk cek apakah sudah pernah diproses.
            $table->timestamp('digiflazz_processed_at')
                ->nullable()
                ->after('digiflazz_response');
        });
    }

    /**
     * Menghapus kolom Digiflazz jika migration di-rollback.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn([
                'digiflazz_status',
                'digiflazz_sn',
                'digiflazz_response',
                'digiflazz_processed_at',
            ]);
        });
    }
};
