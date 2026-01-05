<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Routing\Controller;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ], [
            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'password.required' => 'Password is required.',
        ]);

        $credentials = $request->only('email', 'password');

        /** @var \PHPOpenSourceSaver\JWTAuth\JWTGuard $guard */
        $guard = auth()->guard('api');

        if (! $token = $guard->attempt($credentials)) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'Invalid email or password. Please check your credentials.'
            ], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255|unique:users',
            'username' => 'required|string|max:50|unique:users|alpha_dash', // alpha_dash: letters, numbers, dashes, underscores
            'display_name' => 'required|string|max:50',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
                    ->uncompromised()
            ],
        ], [
            'email.unique' => 'This email is already registered.',
            'username.unique' => 'This username is already taken.',
            'username.alpha_dash' => 'Username can only contain letters, numbers, dashes, and underscores.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.mixed' => 'Password must contain at least one uppercase and one lowercase letter.',
            'password.numbers' => 'Password must contain at least one number.',
            'password.symbols' => 'Password must contain at least one symbol.',
            'password.uncompromised' => 'The given password has appeared in a data leak. Please choose a different password.',
        ]);

        try {
            $user = User::create([
                'email' => $request->email,
                'username' => $request->username,
                'display_name' => $request->display_name,
                'password' => $request->password,
            ]);

            /** @var \PHPOpenSourceSaver\JWTAuth\JWTGuard $guard */
            $guard = auth()->guard('api');
            $token = $guard->login($user);

            return response()->json([
                'message' => 'User created successfully',
                'user' => $user,
                'authorization' => [
                    'token' => $token,
                    'type' => 'bearer',
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Registration Failed',
                'message' => 'An error occurred while registering the user. Please try again later.',
                'debug_message' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile()
    {
        /** @var \PHPOpenSourceSaver\JWTAuth\JWTGuard $guard */
        $guard = auth()->guard('api');
        
        $user = $guard->user();

        if (!$user) {
            return response()->json([
                'error' => 'Not Found',
                'message' => 'User profile not found. The user may have been deleted.'
            ], 404);
        }

        return response()->json([
            'username' => $user->username,
            'display_name' => $user->display_name,
            'email' => $user->email,
        ], 200);
    }

    /**
     * Update the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        /** @var \PHPOpenSourceSaver\JWTAuth\JWTGuard $guard */
        $guard = auth()->guard('api');
        
        $user = $guard->user();

        if (!$user) {
            return response()->json([
                'error' => 'Not Found',
                'message' => 'User profile not found.'
            ], 404);
        }

        /** @var \App\Models\User $user */

        $request->validate([
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'username' => 'sometimes|string|max:50|alpha_dash|unique:users,username,' . $user->id,
            'display_name' => 'sometimes|string|max:50',
        ], [
            'email.unique' => 'This email is already in use.',
            'username.unique' => 'This username is already taken.',
        ]);

        if ($request->has('email')) $user->email = $request->email;
        if ($request->has('username')) $user->username = $request->username;
        if ($request->has('display_name')) $user->display_name = $request->display_name;

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'username' => $user->username,
                'display_name' => $user->display_name,
                'email' => $user->email,
            ]
        ], 200);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        /** @var \PHPOpenSourceSaver\JWTAuth\JWTGuard $guard */
        $guard = auth()->guard('api');
        $guard->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        /** @var \PHPOpenSourceSaver\JWTAuth\JWTGuard $guard */
        $guard = auth()->guard('api');
        return $this->respondWithToken($guard->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => null
        ]);
    }
}
