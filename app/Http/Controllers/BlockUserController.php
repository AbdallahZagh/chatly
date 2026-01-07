<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @OA\Tag(
 *     name="Block System",
 *     description="API Endpoints for blocking and unblocking users"
 * )
 */
class BlockUserController extends Controller
{
    /**
     * Block a user.
     *
     * @OA\Post(
     *     path="/api/auth/users/{id}/block",
     *     summary="Block a user",
     *     tags={"Block System"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the user to block",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User blocked successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="User blocked successfully.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error (e.g. blocking self)",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="You cannot block yourself.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="User not found.")
     *         )
     *     )
     * )
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
     * @OA\Delete(
     *     path="/api/auth/users/{id}/unblock",
     *     summary="Unblock a user",
     *     tags={"Block System"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the user to unblock",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User unblocked successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="User unblocked successfully.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="User is not blocked",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="User is not blocked.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="User not found.")
     *         )
     *     )
     * )
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
     * @OA\Get(
     *     path="/api/auth/users/blocked",
     *     summary="List blocked users",
     *     tags={"Block System"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of blocked users",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="name", type="string"),
     *                     @OA\Property(property="email", type="string")
     *                 )
     *             )
     *         )
     *     )
     * )
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
