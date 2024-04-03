<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{
		$result = $this->resource->toArray();

		if (isset($result['reactions'])) {
			$result['reactions'] = $this->reactions->countBy('name');

			if ($user = $request->user()) {
				$result['my_reaction'] = $this->reactions->where('user_id', $user->id)->value('name');
			}
		}

		return $result;
	}
}
