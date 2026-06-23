"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Generic SSE hook for ticket events.
 *
 * @param {Object} options
 * @param {string} options.url - The SSE endpoint URL
 * @param {boolean} [options.enabled=true] - Whether to connect
 * @returns {{ lastEvent: Object|null, isConnected: boolean, error: string|null }}
 */
export function useTicketSSE({ url, enabled = true }) {
  const [lastEvent, setLastEvent] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null);

  const connect = useCallback(() => {
    if (!enabled || !url) return;

    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastEvent(data);
      } catch {
        // skip malformed events
      }
    };

    es.onerror = () => {
      setIsConnected(false);
      setError("Connection lost. Reconnecting...");
      // EventSource auto-reconnects by default
    };
  }, [url, enabled]);

  useEffect(() => {
    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        setIsConnected(false);
      }
    };
  }, [connect]);

  return { lastEvent, isConnected, error };
}
