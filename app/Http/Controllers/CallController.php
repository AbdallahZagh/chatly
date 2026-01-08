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
}
