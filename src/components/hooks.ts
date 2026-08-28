"use client";

import { useEffect, useRef } from "react";

export function usePolling(callback: () => void, intervalMs = 10000) {
  const cbRef = useRef(callback);
  const skipRef = useRef(false);

  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const id = setInterval(() => {
      if (skipRef.current) return;
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      cbRef.current();
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return skipRef;
}
