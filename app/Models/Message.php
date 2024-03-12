<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $text
 * @property \Illuminate\Support\Carbon $created_at
 */
class Message extends Model
{
	use HasFactory;

	const UPDATED_AT = null;

	protected $table = 'messages';
}
