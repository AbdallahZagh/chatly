<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::middleware('throttle:60,1')->post('register', [AuthController::class, 'register']);
    
    // Login with rate limiting (60 attempts per 1 minute)
    Route::middleware('throttle:60,1')->post('login', [AuthController::class, 'login'])->name('login');
    
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('profile', [AuthController::class, 'profile']);
    Route::put('profile', [AuthController::class, 'updateProfile']);
});

Route::group(['middleware' => 'auth:api'], function () {
    Route::get('/chats', [\App\Http\Controllers\ChatController::class, 'index']);
    Route::post('/chats', [\App\Http\Controllers\ChatController::class, 'store']);
    Route::get('/chats/{id}/messages', [\App\Http\Controllers\ChatController::class, 'show']);
    Route::post('/chats/{id}/messages', [\App\Http\Controllers\ChatController::class, 'sendMessage']);
    // Search Route
    Route::get('/search', [\App\Http\Controllers\ChatController::class, 'search']);

    // Message Management
    Route::put('/messages/{id}', [\App\Http\Controllers\ChatController::class, 'updateMessage']);
    Route::delete('/messages/{id}', [\App\Http\Controllers\ChatController::class, 'deleteMessage']);

    // Block System
    Route::post('/users/{id}/block', [\App\Http\Controllers\BlockUserController::class, 'store']);
    Route::delete('/users/{id}/unblock', [\App\Http\Controllers\BlockUserController::class, 'destroy']);
    Route::get('/users/blocked', [\App\Http\Controllers\BlockUserController::class, 'index']);
});
