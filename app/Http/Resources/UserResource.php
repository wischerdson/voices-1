<?php

namespace App\Http\Resources;

use App\Models\ChamberParticipant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
	public function __construct($resource, public ChamberParticipant $participant)
	{
		parent::__construct($resource);
	}

	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{
		$user = $this->resource->toArray();
		$user['chamber_participant'] = $this->participant;

		return $user;
	}
}
