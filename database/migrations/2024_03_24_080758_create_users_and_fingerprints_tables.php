<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		Schema::create('users', function (Blueprint $table) {
			$table->id();
			$table->string('token');
			$table->timestamp('created_at');
		});

		Schema::create('user_fingerprints', function (Blueprint $table) {
			$table->id();
			$table->foreignId('user_id')->constrained('users');
			$table->string('fingerprint');
		});

		Schema::table('messages', function (Blueprint $table) {
			$table->bigInteger('user_id')->unsigned()->after('id');

			$table->foreign('user_id')->references('id')->on('users');
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('users');
		Schema::dropIfExists('user_fingerprints');
		Schema::table('messages', function (Blueprint $table) {
			$table->dropColumn('user_id');
		});
	}
};
