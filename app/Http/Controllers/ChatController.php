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
        try {
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
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch conversations',
                'message' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    // ... (Repeat for other methods: store, show, sendMessage, search) ...
    // Since I cannot rewrite the entire file in one chunk efficiently if I want to be safe, I will apply this pattern to the 'index' method first as a proof of concept or I can try to replace the whole class body if I am careful.
    // The previous prompt asked to "fix in all apis".
    // I'll do 'store' next in a separate chunk or just rewrite the whole file content if the tool allowed (it doesn't, it replaces chunks).
    // Actually, I can use a large chunk.
    
    // Let's replace the whole body from index to search.
    
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
        try {
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
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Not Found', 'message' => 'User not found'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to start conversation',
                'message' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    /**
     * Get messages for a conversation.
     *
     * @OA\Get(
     *     path="/api/chats/{id}/messages",
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
        try {
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

            $formattedMessages = $messages->through(function ($message) use ($user) {
                // Ensure sender is loaded if not already (it is by 'with')
                // Add is_mine flag
                $message->is_mine = $message->sender_id === $user->id;
                return $message;
            });

            return response()->json($formattedMessages);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Not Found', 'message' => 'Conversation not found'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch messages',
                'message' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

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
        try {
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
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Not Found', 'message' => 'Conversation not found'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to send message',
                'message' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

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
        try {
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
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
             return response()->json([
                'error' => 'Search failed',
                'message' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }
}
