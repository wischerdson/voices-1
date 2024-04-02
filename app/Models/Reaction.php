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
}
