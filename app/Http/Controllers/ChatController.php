<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use Illuminate\Http\Request;

class ChatController extends Controller
{
	public function messages()
	{
		return Message::query()->latest()->get();
	}

	public function sendMessage(Request $request)
	{
		$message = new Message();
		$message->text = $request->message_text;
		$message->save();

		MessageSent::dispatch($message);
	}
}
