<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $external_id
 * @property \Illuminate\Support\Carbon $created_at
 */
class User extends Authenticatable
{
	use HasFactory;

	const UPDATED_AT = null;

	protected $table = 'users';

	protected $casts = [
		'created_at' => 'timestamp',
	];

	public function messages(): HasMany
	{
		return $this->hasMany(Message::class, 'user_id');
	}

	public function fingerprints(): HasMany
	{
		return $this->hasMany(Fingerprint::class, 'user_id');
	}

	protected static function booted()
	{
		static::creating(function (self $model) {
			$model->token = strtolower(Str::random());
		});
	}
}
