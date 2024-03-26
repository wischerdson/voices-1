<?php

use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Route;

Route::get('/user', [ChatController::class, 'user']);
Route::get('/messages', [ChatController::class, 'messages']);
Route::post('/messages', [ChatController::class, 'sendMessage'])->middleware('auth');
