import { useRef } from "react";

export function useDebounce(time: number = 500) {
    const timeout = useRef<NodeJS.Timeout>();

    const debounce = (cb: () => void) => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }

        timeout.current = setTimeout(cb, time);
    }

    return { debounce }

}