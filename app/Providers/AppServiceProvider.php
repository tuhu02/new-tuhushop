<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        if (!app()->runningInConsole()) {
            $host = request()->getHost();
            $isLocalHost = in_array($host, ['localhost', '127.0.0.1', '::1'], true) 
                || str_ends_with($host, '.test') 
                || str_contains($host, 'new-tuhushop');

            if (!$isLocalHost || app()->isProduction() || str_starts_with(config('app.url'), 'https://')) {
                URL::forceScheme('https');
                request()->server->set('HTTPS', 'on');
            }
        } elseif (app()->isProduction() || str_starts_with(config('app.url'), 'https://')) {
            URL::forceScheme('https');
        }

        DB::prohibitDestructiveCommands(app()->isProduction());

        \Illuminate\Pagination\Paginator::currentPathResolver(fn () => url()->current());

        Password::defaults(
            fn(): ?Password => app()->isProduction()
                ? Password::min(12)
                    ->mixedCase()
                    ->letters()
                    ->numbers()
                    ->symbols()
                    ->uncompromised()
                : null,
        );
    }
}
