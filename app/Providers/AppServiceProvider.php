<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

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
        if($this->app->environment('production')) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        if (!defined('L5_SWAGGER_CONST_HOST')) {
            define('L5_SWAGGER_CONST_HOST', env('L5_SWAGGER_CONST_HOST', request()->root() . '/api'));
        }
    }
}
