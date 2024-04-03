<?php

namespace App\Services;

use App\Models\Message;
use App\Models\User;

class Messages
{
	public static function saveReaction(User $user, Message $message, string $reactionName)
	{
		/** @var \App\Models\Reaction */
		$reaction = $user
			->reactions()
			->where('message_id', $message->id)
			->firstOrNew();

		$reaction->name = $reactionName;
		$reaction->message_id = $message->id;

		$user->reactions()->save($reaction);
	}
}
