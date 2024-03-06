<?php

namespace App\Providers;

use App\Mixins\Str as StrMixin;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Foundation\Application;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
	/**
	 * Register any application services.
	 *
	 * @return void
	 */
	public function register()
	{
		Application::getInstance()->useBootstrapPath(base_path('app'));

		env('DB_LOG_SQL_QUERIES', false) && $this->enableDbQueriesLogging();
	}

	/**
	 * Bootstrap any application services.
	 *
	 * @return void
	 */
	public function boot()
	{
		$this->registerMixins();

		JsonResource::withoutWrapping();

		Relation::enforceMorphMap([

		]);
	}

	protected function registerMixins()
	{
		Str::mixin(new StrMixin());
	}

	protected function enableDbQueriesLogging()
	{
		DB::listen(function (QueryExecuted $query) {
			$sql = DB::connection()
				->getQueryGrammar()
				->substituteBindingsIntoRawSql($query->sql, $query->bindings);

			Log::channel('sql')->debug("({$query->time}) " . $sql);
		});
	}
}
