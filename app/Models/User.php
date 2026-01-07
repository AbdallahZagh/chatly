<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'display_name',
        'username',
        'email',
        'password',
        'last_seen_at',
        'deactivated_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_seen_at' => 'datetime',
            'deactivated_at' => 'datetime',
        ];
    }

    /**
     * Virtual Attribute: is_online
     */
    protected $appends = ['is_online'];

    public function getIsOnlineAttribute()
    {
        return $this->last_seen_at && $this->last_seen_at->diffInMinutes(now()) < 5;
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function conversations()
    {
        return $this->belongsToMany(Conversation::class)->withTimestamps();
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function blockedUsers()
    {
        return $this->belongsToMany(User::class, 'blocked_users', 'user_id', 'blocked_user_id')->withTimestamps();
    }

    public function block(User $user)
    {
        $this->blockedUsers()->syncWithoutDetaching([$user->id]);
    }

    public function unblock(User $user)
    {
        $this->blockedUsers()->detach($user->id);
    }

    public function isBlocked(User $user)
    {
        return $this->blockedUsers()->where('blocked_user_id', $user->id)->exists();
    }

    /**
     * Scope a query to only include active users.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->whereNull('deactivated_at');
    }

    public function deactivate()
    {
        $this->deactivated_at = now();
        $this->save();
    }

    public function reactivate()
    {
        $this->deactivated_at = null;
        $this->save();
    }

    public function isDeactivated()
    {
        return !is_null($this->deactivated_at);
    }
}
