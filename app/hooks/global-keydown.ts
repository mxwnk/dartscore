import { useEffect } from "react";

export function useGlobalKeydown(handler: (e: KeyboardEvent) => void) {
    useEffect(() => {
        document.addEventListener('keydown', handler);
    }, [handler]);
}