<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\User;
use App\Services\Messages;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class DatabaseSeeder extends Seeder
{
	/**
	 * Seed the application's database.
	 */
	public function run(): void
	{
		$messages = Message::factory(1000)->create();
		$users = User::query()->take(500)->get();

		for ($i = 0; $i < 1000; $i++) {
			Messages::saveReaction(
				$users->random(),
				$messages->random(),
				Arr::random(['like', 'dislike', 'lol', 'sad', 'crying', 'fuck', 'wow', 'please', 'belissimo', 'fuckyou', 'ok', 'love'])
			);
		}
	}
}
