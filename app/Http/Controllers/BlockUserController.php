<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlockUserController extends Controller
{
    /**
     * Block a user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function store($id)
    {
        try {
            /** @var \App\Models\User $user */
            $user = Auth::user();
            $userToBlock = User::findOrFail($id);

            if ($user->id === $userToBlock->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You cannot block yourself.'
                ], 422);
            }

            if ($user->isBlocked($userToBlock)) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'User is already blocked.'
                ], 200);
            }

            $user->block($userToBlock);

            return response()->json([
                'status' => 'success',
                'message' => 'User blocked successfully.'
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to block user. Please try again later.',
                'error' => $e->getMessage() // Optional: remove in production if sensitive
            ], 500);
        }
    }

    /**
     * Unblock a user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            /** @var \App\Models\User $user */
            $user = Auth::user();
            $userToUnblock = User::findOrFail($id);

            if (!$user->isBlocked($userToUnblock)) {
                 return response()->json([
                    'status' => 'error',
                    'message' => 'User is not blocked.'
                ], 422); // Or 404? 422 seems appropriate for logic error
            }

            $user->unblock($userToUnblock);

            return response()->json([
                'status' => 'success',
                'message' => 'User unblocked successfully.'
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to unblock user. Please try again later.'
            ], 500);
        }
    }

    /**
     * List blocked users.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            /** @var \App\Models\User $user */
            $user = Auth::user();
            $blockedUsers = $user->blockedUsers()->simplePaginate(20); // Pagination for better performance
            
            return response()->json([
                'status' => 'success',
                'data' => $blockedUsers
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve blocked users.'
            ], 500);
        }
    }
}
