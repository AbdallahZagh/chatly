<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CallIncoming implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $offer;
    public $callId;
    public $caller;
    public $receiverId;

    /**
     * Create a new event instance.
     */
    public function __construct($receiverId, $offer, $callId, $caller)
    {
        $this->receiverId = $receiverId;
        $this->offer = $offer;
        $this->callId = $callId;
        
        // Format caller data explicitly to ensure frontend has what it needs
        $this->caller = [
            'id' => $caller->id,
            'name' => $caller->display_name ?? $caller->name ?? $caller->username,
            'username' => $caller->username,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($caller->display_name ?? $caller->name ?? $caller->username),
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        // Broadcast to the receiver's private channel
        return [
            new PrivateChannel('App.Models.User.' . $this->receiverId),
        ];
    }
}
