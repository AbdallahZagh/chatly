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
    /**
     * Get all conversations for the authenticated user.
     *
     * @OA\Get(
     *     path="/api/chats",
     *     tags={"Chat"},
     *     summary="Get all conversations",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of conversations",
     *         @OA\JsonContent(type="array", @OA\Items(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="contact_name", type="string"),
     *             @OA\Property(property="last_message", type="string"),
     *             @OA\Property(property="unread_count", type="integer")
     *         ))
     *     )
     * )
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
    /**
     * Start a new conversation with a user or get existing one.
     *
     * @OA\Post(
     *     path="/api/chats",
     *     tags={"Chat"},
     *     summary="Start/Get Conversation",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"username"},
     *             @OA\Property(property="username", type="string", description="Username of the user to chat with")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Conversation ID",
     *         @OA\JsonContent(@OA\Property(property="id", type="integer"))
     *     )
     * )
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
    /**
     * Get messages for a conversation.
     *
     * @OA\Get(
     *     path="/api/chats/{id}",
     *     tags={"Chat"},
     *     summary="Get Messages",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of messages",
     *         @OA\JsonContent(type="object") 
     *     ),
     *     @OA\Response(response=403, description="Unauthorized")
     * )
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
    /**
     * Send a message to a conversation.
     *
     * @OA\Post(
     *     path="/api/chats/{id}/messages",
     *     tags={"Chat"},
     *     summary="Send Message",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"body"},
     *             @OA\Property(property="body", type="string"),
     *             @OA\Property(property="type", type="string", enum={"text","image","file"}, default="text")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Message Sent")
     * )
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
    /**
     * Search for users.
     *
     * @OA\Get(
     *     path="/api/search",
     *     tags={"Search"},
     *     summary="Search Users",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="query",
     *         in="query",
     *         required=true,
     *         @OA\Schema(type="string", minLength=3)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Search results",
     *         @OA\JsonContent(type="array", @OA\Items(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="username", type="string"),
     *             @OA\Property(property="display_name", type="string"),
     *             @OA\Property(property="avatar", type="string")
     *         ))
     *     )
     * )
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
