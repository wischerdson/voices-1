<?php

use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Route;

Route::get('/user', [ChatController::class, 'user']);

Route::middleware('auth')->group(function () {
	Route::get('/messages', [ChatController::class, 'messages']);
	Route::post('/messages', [ChatController::class, 'sendMessage']);
	Route::post('/reactions', [ChatController::class, 'saveReaction']);
	Route::delete('/reactions', [ChatController::class, 'deleteReaction']);
});
