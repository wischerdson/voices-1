<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property int $chamber_id
 * @property string $name
 * @property string $color
 */
class ChamberParticipant extends Model
{
    use HasFactory;

	public $timestamps = false;

	protected $table = 'chamber_participants';

	protected $hidden = ['user_id'];

	public function chamber(): BelongsTo
	{
		return $this->belongsTo(Chamber::class, 'chamber_id');
	}

	public function messages(): HasMany
	{
		return $this->hasMany(Message::class, 'chamber_participant_id');
	}

	public function user(): BelongsTo
	{
		return $this->belongsTo(User::class, 'user_id');
	}

	protected static function booted()
	{
		static::creating(function (self $model) {
			$model->name = $model->name ?? fake('en_US')->name();
			$model->color = $model->color ?? fake()->randomElement(['red', 'pink', 'purple', 'indigo', 'sky', 'cyan', 'emerald', 'white', 'lime', 'amber']);
		});
	}
}
