<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    /**
     * Get all conversations for the authenticated user.
     */
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $conversations = $user->conversations()
            ->with(['users' => function ($query) use ($user) {
                $query->where('users.id', '!=', $user->id);
            }, 'lastMessage'])
            ->orderBy('updated_at', 'desc')
            ->get();

        // Format for UI
        $formatted = $conversations->map(function ($conversation) {
            $contact = $conversation->users->first(); // The other user
            $lastMsg = $conversation->lastMessage;

            return [
                'id' => $conversation->id,
                'contact_name' => $contact ? ($contact->display_name ?? $contact->username) : 'Unknown',
                'contact_avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($contact->display_name ?? 'User'),
                'last_message' => $lastMsg ? $lastMsg->body : 'No messages yet',
                'timestamp' => $lastMsg ? $lastMsg->created_at->format('h:i A') : $conversation->updated_at->format('h:i A'),
                'unread_count' => 0, // Placeholder for now, can implement read receipts later
                'is_online' => $contact ? $contact->is_online : false,
            ];
        });

        return response()->json($formatted);
    }

    /**
     * Start a new conversation with a user or get existing one.
     */
    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string|exists:users,username',
        ]);

        /** @var \App\Models\User $me */
        $me = Auth::user();
        $otherUser = User::where('username', $request->username)->firstOrFail();

        if ($me->id === $otherUser->id) {
            return response()->json(['error' => 'You cannot chat with yourself'], 400);
        }

        // Check if conversation exists
        // Filter conversations where I am a participant, and the other user is also a participant
        $conversation = Conversation::whereHas('users', function ($q) use ($me) {
            $q->where('users.id', $me->id);
        })->whereHas('users', function ($q) use ($otherUser) {
            $q->where('users.id', $otherUser->id);
        })->first();

        if (!$conversation) {
            $conversation = Conversation::create();
            $conversation->users()->attach([$me->id, $otherUser->id]);
        }

        return response()->json(['id' => $conversation->id]);
    }

    /**
     * Get messages for a conversation.
     */
    public function show($id)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $conversation = Conversation::findOrFail($id);

        // Security: Check if user belongs to this conversation
        if (!$conversation->users()->where('users.id', $user->id)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $messages = $conversation->messages()
            ->with('sender')
            ->orderBy('created_at', 'desc') // Latest first for UI scrolling up
            ->paginate(20);

        return response()->json($messages);
    }

    /**
     * Send a message to a conversation.
     */
    public function sendMessage(Request $request, $id)
    {
        $request->validate([
            'body' => 'nullable|string',
            'type' => 'in:text,image,file',
        ]);
        
        // If body is empty and type is text -> fail
        if (!$request->body && $request->type === 'text') {
            return response()->json(['error' => 'Message body required'], 422);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $conversation = Conversation::findOrFail($id);

        if (!$conversation->users()->where('users.id', $user->id)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $message = $conversation->messages()->create([
            'sender_id' => $user->id,
            'body' => $request->body,
            'type' => $request->type ?? 'text',
        ]);

        // Update conversation timestamp for sorting
        $conversation->touch();

        // Broadcast Event
        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message);
    }
    /**
     * Search for users by username, display_name, or email.
     */
    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:3',
        ]);

        $query = $request->input('query');
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();

        $users = User::where('id', '!=', $currentUser->id)
            ->where(function ($q) use ($query) {
                // Performance optimized: "starting with" search uses indexes efficiently
                $q->where('username', 'LIKE', "{$query}%")
                  ->orWhere('display_name', 'LIKE', "{$query}%")
                  ->orWhere('email', 'LIKE', "{$query}%");
            })
            ->limit(20) // Limit results for performance
            ->get(['id', 'username', 'display_name', 'email']); // Only fetch necessary fields

        $formatted = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'username' => $user->username,
                'display_name' => $user->display_name,
                'email' => $user->email,
                'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($user->display_name),
            ];
        });

        return response()->json($formatted);
    }
}
