"use client";

import { useEffect, useRef, useCallback } from "react";

interface SSEMessage {
  type: string;
  count?: number;
  latestEvents?: unknown[];
}

export function useSSE(onMessage: (data: SSEMessage) => void) {
  const callbackRef = useRef(onMessage);
  callbackRef.current = onMessage;

  const connect = useCallback(() => {
    const eventSource = new EventSource("/api/stream");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SSEMessage;
        if (data.type !== "PING" && data.type !== "CONNECTED") {
          callbackRef.current(data);
        }
      } catch {
        // ignore parse errors
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      // Reconnect after 3 seconds
      setTimeout(connect, 3000);
    };

    return eventSource;
  }, []);

  useEffect(() => {
    const eventSource = connect();
    return () => eventSource.close();
  }, [connect]);
}
