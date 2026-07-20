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

    if (!appKey || appKey.includes('${') || appKey.includes('{')) {
        return null;
    }

    let wsHost = import.meta.env.VITE_REVERB_HOST;
    if (wsHost && (wsHost.includes('${') || wsHost.includes('{'))) {
        wsHost = window.location.hostname;
    } else {
        wsHost = wsHost || window.location.hostname;
    }

    let wsPort = import.meta.env.VITE_REVERB_PORT;
    if (wsPort && (String(wsPort).includes('${') || String(wsPort).includes('{'))) {
        wsPort = undefined;
    }

    let wsScheme = import.meta.env.VITE_REVERB_SCHEME;
    if (wsScheme && (wsScheme.includes('${') || wsScheme.includes('{'))) {
        wsScheme = 'https';
    } else {
        wsScheme = wsScheme || 'https';
    }

    window.Pusher = Pusher;

    cachedEcho = new Echo({
        broadcaster: 'reverb',
        key: appKey,
        wsHost: wsHost,
        wsPort: Number(wsPort || 80),
        wssPort: Number(wsPort || 443),
        forceTLS: wsScheme === 'https',
        enabledTransports: ['ws', 'wss'],
    });

    window.Echo = cachedEcho;

    return cachedEcho;
}

export function getEcho(): Echo<'reverb'> | null {
    return cachedEcho;
}
