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
		$message = $this->resource->toArray();

		if (isset($message['reactions'])) {
			$message['reactions'] = $this->reactions->countBy('name');

			if ($user = $request->user()) {
				$message['my_reaction'] = $this->reactions->where('user_id', $user->id)->value('name');
			}
		}

		return $message;
	}
}
