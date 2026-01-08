<?php

namespace App\Http\Controllers;

use App\Events\CallAccepted;
use App\Events\CallIncoming;
use App\Events\CallRejected;
use App\Events\IceCandidateSent;
use App\Models\Call;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @OA\Tag(
 *     name="Video Calls",
 *     description="API Endpoints for WebRTC Video Calling Signaling"
 * )
 */
class CallController extends Controller
{
    /**
     * Initiate a call.
     *
     * @OA\Post(
     *     path="/api/calls/initiate",
     *     tags={"Video Calls"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"receiver_id", "offer", "type"},
     *             @OA\Property(property="receiver_id", type="integer"),
     *             @OA\Property(property="offer", type="object", description="SDP Offer"),
     *             @OA\Property(property="type", type="string", enum={"video", "audio"}, default="video")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Call initiated"
     *     )
     * )
     */
    public function initiate(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'offer' => 'required',
            'type' => 'in:video,audio'
        ]);

        $caller = Auth::user();
        if ($caller->id == $request->receiver_id) {
            return response()->json(['error' => 'Cannot call yourself'], 422);
        }

        // Create Call Record
        $call = Call::create([
            'caller_id' => $caller->id,
            'receiver_id' => $request->receiver_id,
            'type' => $request->type ?? 'video',
            'status' => 'initiating',
        ]);

        // Broadcast Event to Receiver
        broadcast(new CallIncoming(
            $request->receiver_id,
            $request->offer,
            $call->id,
            $caller
        ))->toOthers();

        return response()->json([
            'status' => 'success',
            'call_id' => $call->id,
            'message' => 'Call initiated'
        ]);
    }

    /**
     * Accept a call.
     *
     * @OA\Post(
     *     path="/api/calls/{id}/accept",
     *     tags={"Video Calls"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"answer"},
     *             @OA\Property(property="answer", type="object", description="SDP Answer")
     *         )
     *     )
     *     @OA\Response(
     *         response=200,
     *         description="Call accepted"
     *     )
     * )
     */
    public function accept(Request $request, $id)
    {
        $request->validate(['answer' => 'required']);

        $call = Call::findOrFail($id);
        $user = Auth::user();

        if ($call->receiver_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($call->status !== 'initiating') {
             return response()->json(['error' => 'Call is no longer valid'], 422);
        }

        $call->update([
            'status' => 'in-progress',
            'started_at' => now(),
        ]);

        // Broadcast Answer to Caller
        broadcast(new CallAccepted(
            $call->caller_id,
            $request->answer,
            $call->id
        ))->toOthers();

        return response()->json(['status' => 'success', 'message' => 'Call accepted']);
    }

    /**
     * Reject a call.
     *
     * @OA\Post(
     *     path="/api/calls/{id}/reject",
     *     tags={"Video Calls"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Call rejected"
     *     )
     * )
     */
    public function reject(Request $request, $id)
    {
        $call = Call::findOrFail($id);
        $user = Auth::user();

        // Allow both caller (cancel) and receiver (decline) to reject/end
        if ($call->receiver_id !== $user->id && $call->caller_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $call->update(['status' => 'rejected']);

        // Notify the OTHER party
        $targetId = ($user->id === $call->caller_id) ? $call->receiver_id : $call->caller_id;
        
        broadcast(new CallRejected($targetId, $call->id))->toOthers();

        return response()->json(['status' => 'success', 'message' => 'Call rejected']);
    }

    /**
     * Exhange ICE Candidates.
     *
     * @OA\Post(
     *     path="/api/calls/{id}/ice-candidate",
     *     tags={"Video Calls"},
     *     security={{"bearerAuth":{}}},
     *      @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"candidate", "target_user_id"},
     *             @OA\Property(property="candidate", type="object"),
     *             @OA\Property(property="target_user_id", type="integer")
     *         )
     *     )
     *     @OA\Response(
     *         response=200,
     *         description="ICE Candidate relayed"
     *     )
     * )
     */
    public function iceCandidate(Request $request, $id)
    {
        $request->validate([
            'candidate' => 'required',
            'target_user_id' => 'required|exists:users,id'
        ]);

        // Simple relay
        broadcast(new IceCandidateSent(
            $request->target_user_id,
            $request->candidate,
            $id
        ))->toOthers();

        return response()->json(['status' => 'success']);
    }
    /**
     * Get call history.
     *
     * @OA\Get(
     *     path="/api/calls",
     *     tags={"Video Calls"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of recent calls",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array", @OA\Items(
     *                 @OA\Property(property="id", type="string"),
     *                 @OA\Property(property="direction", type="string", enum={"incoming", "outgoing"}),
     *                 @OA\Property(property="type", type="string", enum={"video", "audio"}),
     *                 @OA\Property(property="status", type="string"),
     *                 @OA\Property(property="duration", type="string"),
     *                 @OA\Property(property="started_at", type="string", format="date-time"),
     *                 @OA\Property(property="other_party", type="object",
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="name", type="string"),
     *                     @OA\Property(property="avatar", type="string")
     *                 )
     *             ))
     *         )
     *     )
     * )
     */
    public function index()
    {
        $user = Auth::user();
        
        $calls = Call::where('caller_id', $user->id)
            ->orWhere('receiver_id', $user->id)
            ->with(['caller', 'receiver'])
            ->orderBy('created_at', 'desc')
            ->simplePaginate(20);
            
        return response()->json($calls->through(function ($call) use ($user) {
            $isCaller = $call->caller_id === $user->id;
            $otherParty = $isCaller ? $call->receiver : $call->caller;
            
            // Calculate duration
            $duration = '0s';
            if ($call->started_at && $call->ended_at) {
                 $diff = $call->started_at->diff($call->ended_at);
                 $duration = $diff->format('%im %ss');
                 if ($diff->h > 0) $duration = $diff->format('%hh %im %ss');
            }

            return [
                'id' => $call->id,
                'direction' => $isCaller ? 'outgoing' : 'incoming',
                'type' => $call->type,
                'status' => $call->status, // completed, rejected, missed, etc.
                'started_at' => $call->created_at->toIso8601String(),
                'duration' => $duration,
                'other_party' => [
                    'id' => $otherParty->id,
                    'name' => $otherParty->display_name ?? $otherParty->username,
                    'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($otherParty->display_name ?? 'User'),
                    'is_online' => $otherParty->is_online
                ]
            ];
        }));
    }
}
