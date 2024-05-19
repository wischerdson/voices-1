<?php

namespace App\Http\Controllers;

use App\Events\MessageReactionsChanged;
use App\Events\MessageSent;
use App\Exceptions\MessageNotFoundException;
use App\Http\Resources\MessageResource;
use App\Http\Resources\UserResource;
use App\Models\Chamber;
use App\Models\ChamberParticipant;
use App\Models\Message;
use App\Models\User;
use App\Services\Messages;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
	public function user(Request $request)
	{
		/** @var \App\Models\User $user */
		if (!$user = Auth::getUser()) {
			$user = new User();
			$user->save();
		}

		if (!$chamber = Chamber::query()->where('code', $request->chamber)->first()) {
			$chamber = new Chamber(['code' => $request->chamber]);
			$chamber->save();
		}

		$chamberParticipant = ChamberParticipant::query()
			->where('user_id', $user->id)
			->where('chamber_id', $chamber->id)
			->first();

		if (!$chamberParticipant) {
			$chamberParticipant = new ChamberParticipant();
			$chamberParticipant->user_id = $user->id;
			$chamber->participants()->save($chamberParticipant);
		}

		return new UserResource($user, $chamberParticipant);
	}

	public function messages(Request $request)
	{
		$request->validate([
			'limit' => 'required|numeric|max:1000',
			'offset' => 'required|numeric',
		]);

		$messages = Message::query()
			->with('reactions', 'chamberParticipant')
			->whereHas('chamber', function (Builder $query) use ($request) {
				$query->where('code', $request->chamber);
			})
			->limit($request->limit)
			->offset($request->offset)
			->latest()
			->get();

		return MessageResource::collection($messages);
	}

	public function sendMessage(Request $request)
	{
		$request->validate([
			'text' => 'required',
			'client_code' => 'required',
			'chamber' => 'required'
		]);

		$message = new Message($request->all());

		/** @var \App\Models\User $user */
		$user = $request->user();
		$chamberParticipant = $user->chamberParticipants()
			->whereHas('chamber', function (Builder $query) use ($request) {
				$query->where('code', $request->chamber);
			})
			->first();

		$chamberParticipant->messages()->save($message);

		$message->setRelation('chamberParticipant', $chamberParticipant);

		MessageSent::dispatch($message);

		return $message;
	}

	public function saveReaction(Request $request)
	{
		$request->validate([
			'reaction_name' => 'required',
			'message_id' => 'required'
		]);

		if (!$message = Message::find($request->message_id)) {
			throw new MessageNotFoundException();
		}

		Messages::saveReaction($request->user(), $message, $request->reaction_name);

		MessageReactionsChanged::dispatch($message->id);
	}

	public function deleteReaction(Request $request)
	{
		$request->validate([
			'message_id' => 'required'
		]);

		$request->user()->reactions()->where('message_id', $request->message_id)->delete();

		MessageReactionsChanged::dispatch($request->message_id);
	}
}
