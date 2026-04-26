<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DigiflazzStatusUpdated implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public string $reference,
        public string $merchantRef,
        public ?string $digiflazzStatus,
        public ?string $digiflazzSn,
    ) {}

    public function broadcastOn(): Channel
    {
        return new Channel('transaction.' . $this->reference);
    }

    public function broadcastAs(): string
    {
        return 'digiflazz.status.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'reference' => $this->reference,
            'merchant_ref' => $this->merchantRef,
            'digiflazz_status' => $this->digiflazzStatus,
            'digiflazz_sn' => $this->digiflazzSn,
        ];
    }
}
