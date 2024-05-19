<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string|null $code
 * @property \Illuminate\Support\Carbon $created_at
 */
class Chamber extends Model
{
    use HasFactory;

	const UPDATED_AT = null;

	protected $table = 'chambers';

	protected $fillable = ['code'];

	public function participants()
	{
		return $this->hasMany(ChamberParticipant::class, 'chamber_id');
	}
}
