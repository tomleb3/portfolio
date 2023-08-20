import { useRef } from 'react';

export function useClickCounter(targetCount: number, callback: () => any): () => void {
    const clickCounterRef = useRef(0);

    const click = () => {
        // 5 clicks.
        if (clickCounterRef.current < targetCount - 1) {
            clickCounterRef.current = clickCounterRef.current + 1;
            return;
        }
        clickCounterRef.current = 0;
        callback();
    };

    return click;
}
