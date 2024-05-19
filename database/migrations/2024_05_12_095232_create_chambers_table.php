<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		Schema::create('chambers', function (Blueprint $table) {
			$table->id();
			$table->string('code')->nullable()->unique();
			$table->timestamp('created_at')->useCurrent();
		});

		DB::table('chambers')->insert(['code' => null]);

		Schema::create('chamber_participants', function (Blueprint $table) {
			$table->id();
			$table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
			$table->foreignId('chamber_id')->constrained('chambers')->cascadeOnDelete();
			$table->string('name');
			$table->string('color');
		});

		Schema::table('messages', function (Blueprint $table) {
			$table->bigInteger('chamber_participant_id')
				->unsigned()
				->after('user_id');
		});

		$usersQuery = DB::query()->from('users')->take(500);

		foreach ($usersQuery->cursor() as $user) {
			DB::table('chamber_participants')->insert([
				'user_id' => $user->id,
				'chamber_id' => 1,
				'name' => fake('en')->name(),
				'color' => fake('en')->randomElement(['red', 'pink', 'purple', 'indigo', 'sky', 'cyan', 'emerald', 'white', 'lime', 'amber'])
			]);
		}

		$participantsQuery = DB::query()->from('chamber_participants')->take(500);

		foreach ($participantsQuery->cursor() as $participant) {
			DB::table('messages')->where('user_id', $participant->user_id)->update([
				'chamber_participant_id' => $participant->id
			]);
		}

		Schema::table('messages', function (Blueprint $table) {
			$table->dropForeign(['user_id']);
			$table->dropColumn('user_id');

			$table->foreign('chamber_participant_id')
				->references('id')
				->on('chamber_participants')
				->cascadeOnDelete();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::table('messages', function (Blueprint $table) {
			$table->dropColumn('chamber_id');

			$table->foreignId('user_id')->after('id')->constrained('users')->cascadeOnDelete();
		});

		Schema::dropIfExists('chamber_participants');
		Schema::dropIfExists('chambers');
	}
};
