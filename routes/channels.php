<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Conversation;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat.{conversationId}', function ($user, $conversationId) {
    return Conversation::find($conversationId)->users->contains('id', $user->id);
});

Broadcast::channel('presence-chat', function ($user) {
    return ['id' => $user->id, 'name' => $user->display_name];
});
