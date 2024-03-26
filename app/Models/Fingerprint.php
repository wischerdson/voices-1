<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property string $fingerprint
 */
class Fingerprint extends Model
{
	use HasFactory;

	public $timestamps = false;

	protected $table = 'user_fingerprints';

	protected $fillable = ['fingerprint'];

	public function user(): BelongsTo
	{
		return $this->belongsTo(User::class, 'user_id');
	}
}
