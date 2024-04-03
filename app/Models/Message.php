<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $client_code
 * @property int $user_id
 * @property string $text
 * @property \Illuminate\Support\Carbon $created_at
 */
class Message extends Model
{
	use HasFactory;

	const UPDATED_AT = null;

	protected $table = 'messages';

	protected $fillable = ['client_code', 'text'];

	protected $casts = [
		'created_at' => 'timestamp',
	];

	public function user(): BelongsTo
	{
		return $this->belongsTo(User::class, 'user_id');
	}

	public function reactions(): HasMany
	{
		return $this->hasMany(Reaction::class, 'message_id');
	}
}
