<?php

namespace App\Http\Controllers;

use App\Events\MessageReactionsChanged;
use App\Events\MessageSent;
use App\Exceptions\MessageNotFoundException;
use App\Http\Resources\MessageResource;
use App\Models\Fingerprint;
use App\Models\Message;
use App\Models\User;
use App\Services\Messages;
use Illuminate\Http\Request;

class ChatController extends Controller
{
	public function user(Request $request)
	{
		/**
		 * Пришедший список отпечатков в виде строке, разделенных запятой, превращаем
		 * в коллекцию.
		 */
		$fingerprintsFromRequest = collect(
			explode(',', $request->fingerprints)
		);

		/**
		 * Пробуем найти в базе данных хотя бы одно совпадение, чтобы идентифицировать пользователя.
		 *
		 * @var \Illuminate\Database\Eloquent\Collection
		 */
		$foundFingerprints = Fingerprint::query()
			->whereIn('fingerprint', $fingerprintsFromRequest)
			->with('user')
			->get();

		/**
		 * Если из всего списка отпечатков не нашлось ни одного совпадения, то создаем
		 * нового пользователя.
		 *
		 * @var \App\Models\User $user
		 */
		if ($foundFingerprints->isEmpty() || !$user = $foundFingerprints->first()->user) {
			$user = new User();
			$user->save();
		}

		/**
		 * Все отпечатки, пришедшие из запроса, но отсутствующие в базе нужно привязать к
		 * пользователю.
		 */
		$missingFingerprints = $fingerprintsFromRequest
			->diff($foundFingerprints->pluck('fingerprint'))
			->map(fn ($fp) => new Fingerprint(['fingerprint' => $fp]));

		$user->fingerprints()->saveMany($missingFingerprints);

		return $user;
	}

	public function messages(Request $request)
	{
		$request->validate([
			'limit' => 'required|numeric|max:1000',
			'offset' => 'required|numeric',
		]);

		$messages = Message::query()
			->with('reactions')
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
		]);

		$message = new Message($request->all());

		$request->user()->messages()->save($message);

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
