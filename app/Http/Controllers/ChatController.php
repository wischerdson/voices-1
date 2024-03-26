<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Http\Resources\UserResource;
use App\Models\Fingerprint;
use App\Models\Message;
use App\Models\User;
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

		return new UserResource($user);
	}

	public function messages(Request $request)
	{
		$request->validate([
			'limit' => 'required|numeric|max:1000',
			'offset' => 'required|numeric',
		]);

		return Message::query()
			->limit($request->limit)
			->offset($request->offset)
			->latest()
			->get();
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
}
