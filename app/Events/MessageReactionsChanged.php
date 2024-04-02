<?php

namespace App\Events;

use App\Models\Message;
use App\Models\Reaction;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class MessageReactionsChanged implements ShouldBroadcastNow
{
	use Dispatchable, InteractsWithSockets, SerializesModels;

	public Collection $reactions;

	public int $messageId;

	/**
	 * Create a new event instance.
	 */
	public function __construct(Message $message)
	{
		$this->reactions = DB::table((new Reaction())->getTable())
			->select('name')
			->selectRaw('count(*) as `count`')
			->where('message_id', $message->id)
			->orderBy('count', 'desc')
			->groupBy('name')
			->pluck('count', 'name');

		$this->messageId = $message->id;
	}

	/**
	 * Get the channels the event should broadcast on.
	 *
	 * @return array<int, \Illuminate\Broadcasting\Channel>
	 */
	public function broadcastOn(): array
	{
		return ['reactions'];
	}
}
