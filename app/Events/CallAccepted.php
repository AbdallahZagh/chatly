<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CallAccepted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $answer;
    public $callId;
    public $callerId;

    /**
     * Create a new event instance.
     */
    public function __construct($callerId, $answer, $callId)
    {
        $this->callerId = $callerId;
        $this->answer = $answer;
        $this->callId = $callId;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        // Broadcast back to the original caller
        return [
            new PrivateChannel('App.Models.User.' . $this->callerId),
        ];
    }
}
