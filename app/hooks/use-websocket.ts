'use client';

import { useEffect, useRef, useState } from 'react';

export function useWebSocket(url: string) {
    const ref = useRef<WebSocket>(null);
    const [, update] = useState(0);

    useEffect(() => {
        if (ref.current) return;
        const socket = new WebSocket(url);
        ref.current = socket;
        update((p) => p + 1);

        return () => socket.close();
    }, [url]);

    return ref.current;
}