import { useEffect, useRef, useState } from 'react';

/**
 * Delays updating a value until after the specified delay has passed
 * since the last change. Useful for debouncing search inputs.
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debounced, setDebounced] = useState<T>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebounced(value);
    }, delayMs);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [value, delayMs]);

  return debounced;
}
