<?php

namespace Database\Factories;

use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
	protected $model = Message::class;

	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array
	{
		return [
			'text' => fake()->boolean() ? fake()->sentence() : fake()->paragraph(),
			'user_id' => User::factory(),
			'client_code' => strtolower(Str::random(6)),
			'created_at' => fake()->dateTimeBetween('-1 week')
		];
	}
}
