import { useEffect, useRef } from 'react';

// Define the type for the callback function
type Callback = () => void;

export function useInterval(callback: Callback, delay: number | null) {
  const savedCallback = useRef<Callback | null>(null);
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      // Type assertion to ensure savedCallback.current is callable
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [delay]);
}
