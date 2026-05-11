<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GenerateSeederFromTable extends Command
{
    protected $signature = 'make:seeder-from-table {table} {--name=}';
    protected $description = 'Generate Laravel seeder from existing database table data';

    public function handle()
    {
        $table = $this->argument('table');

        $seederName = $this->option('name')
            ?: Str::studly(Str::singular($table)) . 'Seeder';

        $rows = DB::table($table)->get()->map(function ($row) {
            return (array) $row;
        })->toArray();

        if (empty($rows)) {
            $this->warn("Table {$table} kosong.");
            return;
        }

        $data = var_export($rows, true);

        $content = <<<PHP
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class {$seederName} extends Seeder
{
    public function run(): void
    {
        DB::table('{$table}')->insert({$data});
    }
}

PHP;

        $path = database_path("seeders/{$seederName}.php");

        file_put_contents($path, $content);

        $this->info("Seeder berhasil dibuat: database/seeders/{$seederName}.php");
    }
}