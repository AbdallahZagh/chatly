<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class IceCandidateSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $candidate;
    public $callId;
    public $targetUserId;

    /**
     * Create a new event instance.
     */
    public function __construct($targetUserId, $candidate, $callId)
    {
        $this->targetUserId = $targetUserId;
        $this->candidate = $candidate;
        $this->callId = $callId;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('App.Models.User.' . $this->targetUserId),
        ];
    }
}
