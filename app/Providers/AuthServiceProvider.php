<?php

namespace App\Providers;

use App\Services\Auth\Guard;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Auth;

class AuthServiceProvider extends ServiceProvider
{
	/**
	 * The model to policy mappings for the application.
	 *
	 * @var array<class-string, class-string>
	 */
	protected $policies = [
		//
	];

	/**
	 * Register any authentication / authorization services.
	 */
	public function boot(): void
	{
		Auth::extend('custom', fn (Application $app) => new Guard($app));
	}
}
