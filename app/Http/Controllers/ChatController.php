<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use Illuminate\Http\Request;

class ChatController extends Controller
{
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
		$message = new Message();
		$message->text = $request->message_text;
		$message->save();

		MessageSent::dispatch($message);

		return $message;
	}
}
