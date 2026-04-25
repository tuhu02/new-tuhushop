<?php

namespace App\Console\Commands;

use App\Services\DigiflazzService;
use App\Services\SyncDigiflazzService;
use Illuminate\Console\Command;

class SyncDigiflazzPriceList extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'digiflazz:sync {--validate-only : Only validate API credentials}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync price list from Digiflazz API';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Digiflazz Price List Sync');
        $this->line('');

        $digiflazzService = new DigiflazzService();

        // Validate credentials
        if ($this->option('validate-only')) {
            $this->info('Validating Digiflazz API credentials...');

            if ($digiflazzService->validateCredentials()) {
                $this->info('✓ API credentials are valid');
                return Command::SUCCESS;
            } else {
                $this->error('✗ API credentials are invalid');
                return Command::FAILURE;
            }
        }

        // Start sync
        $this->info('Starting price list sync from Digiflazz...');
        $this->line('');

        $syncService = new SyncDigiflazzService($digiflazzService);
        $result = $syncService->sync();

        if ($result['success']) {
            $this->info("✓ {$result['message']}");
        } else {
            $this->error("✗ {$result['message']}");
        }

        // Show statistics
        $this->line('');
        $this->info('Sync Statistics:');
        $stats = $syncService->getStats();

        foreach ($stats as $key => $value) {
            $this->line("  • $key: $value");
        }

        return $result['success'] ? Command::SUCCESS : Command::FAILURE;
    }
}
