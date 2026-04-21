import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher?: typeof Pusher;
        Echo?: Echo<'reverb'>;
    }
}

let cachedEcho: Echo<'reverb'> | null = null;

export function initializeEcho(): Echo<'reverb'> | null {
    if (typeof window === 'undefined') {
        return null;
    }

    if (cachedEcho) {
        return cachedEcho;
    }

    const appKey = import.meta.env.VITE_REVERB_APP_KEY;

    if (!appKey) {
        return null;
    }

    window.Pusher = Pusher;

    cachedEcho = new Echo({
        broadcaster: 'reverb',
        key: appKey,
        wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
        wsPort: Number(import.meta.env.VITE_REVERB_PORT || 80),
        wssPort: Number(import.meta.env.VITE_REVERB_PORT || 443),
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
    });

    window.Echo = cachedEcho;

    return cachedEcho;
}

export function getEcho(): Echo<'reverb'> | null {
    return cachedEcho;
}
