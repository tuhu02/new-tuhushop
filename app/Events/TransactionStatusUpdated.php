<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TransactionStatusUpdated implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public function __construct(
        public string $reference,
        public string $status,
        public string $merchantRef,
    ) {}

    public function broadcastOn(): Channel
    {
        return new Channel("transaction.{$this->reference}");
    }

    public function broadcastAs(): string
    {
        return 'transaction.status.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'reference' => $this->reference,
            'merchant_ref' => $this->merchantRef,
            'status' => $this->status,
        ];
    }
}
