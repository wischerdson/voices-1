<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Auth\GuardHelpers;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Guard as AuthGuard;
use Illuminate\Contracts\Foundation\Application;

class Guard implements AuthGuard
{
	use GuardHelpers;

	protected Application $app;

	public function __construct(Application $app)
	{
		$this->app = $app;
	}

	public function user(): ?Authenticatable
	{
		if ($this->user) {
			return $this->user;
		}

		$request = $this->app->make('request');

		if (!$bearerToken = $request->bearerToken()) {
			return null;
		}

		if (!str_contains($bearerToken, ':')) {
			return null;
		}

		[$userId, $userToken] = explode(':', $bearerToken, 2);

		return $this->user = User::query()
			->where('id', $userId)
			->where('token', $userToken)
			->first();
	}

	public function validate(array $credentials = []): bool
	{
		return true;
	}

	public function setUser(Authenticatable $user)
	{
		$this->user = $user;
	}
}
