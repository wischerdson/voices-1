<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

/**
 * @property int $id
 * @property string $client_code
 * @property int $chamber_participant_id
 * @property string $text
 * @property \Illuminate\Support\Carbon $created_at
 */
class Message extends Model
{
	use HasFactory;

	const UPDATED_AT = null;

	protected $table = 'messages';

	protected $fillable = ['client_code', 'text'];

	protected $hidden = ['chamber_participant_id'];

	protected $casts = [
		'created_at' => 'timestamp',
	];

	public function reactions(): HasMany
	{
		return $this->hasMany(Reaction::class, 'message_id');
	}

	public function chamberParticipant(): BelongsTo
	{
		return $this->belongsTo(ChamberParticipant::class, 'chamber_participant_id');
	}

	public function chamber(): HasOneThrough
	{
		return $this->hasOneThrough(Chamber::class, ChamberParticipant::class, 'id', 'id', 'chamber_participant_id', 'chamber_id');
	}
}
