'use client';
import { useEffect, useRef } from 'react';

export default function WakeLock() {
    const wakeLock = useRef<WakeLockSentinel | null>(null);

    useEffect(() => {
        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator) {
                    wakeLock.current = await (navigator as any).wakeLock.request('screen');
                } else {
                    console.warn('Wake Lock API is not supported in this browser.');
                }
            } catch (err) {
                console.error(err);
            }
        };

        requestWakeLock();

        const handleVisibilityChange = () => {
            if (wakeLock.current !== null && document.visibilityState === 'visible') {
                requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            wakeLock.current?.release();
            wakeLock.current = null;
        };
    }, []);

    return <></>;
}
