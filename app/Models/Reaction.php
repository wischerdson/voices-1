<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $user_id
 * @property int $message_id
 * @property string $name
 * @property \Illuminate\Support\Carbon $created_at
 */
class Reaction extends Model
{
	use HasFactory;

	const UPDATED_AT = null;

	protected $table = 'reactions';

	protected function setKeysForSaveQuery($query)
	{
		return $query
			->where('user_id', $this->user_id)
			->where('message_id', $this->message_id);
	}
}
