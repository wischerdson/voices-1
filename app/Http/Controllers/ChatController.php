<?php

namespace App\Http\Controllers;

use App\Events\MessageReactionsChanged;
use App\Events\MessageSent;
use App\Exceptions\MessageNotFoundException;
use App\Http\Resources\MessageResource;
use App\Models\Message;
use App\Models\User;
use App\Services\Messages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
	public function user()
	{
		if ($user = Auth::getUser()) {
			return $user;
		}

		$user = new User();
		$user->save();

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
