<?php

use App\Services\TripayService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('tripay:sync-channels', function (TripayService $tripay) {
    try {
        $result = $tripay->syncPaymentChannels();

        $this->info('Sinkronisasi Tripay berhasil.');
        $this->line("Channel baru      : {$result['created']}");
        $this->line("Channel diperbarui: {$result['updated']}");
        $this->line("Channel dilewati  : {$result['skipped']}");
    } catch (\Throwable $exception) {
        $this->error('Sinkronisasi Tripay gagal: ' . $exception->getMessage());
        report($exception);

        return self::FAILURE;
    }

    return self::SUCCESS;
})->purpose('Sync payment channels from Tripay API');
