import { useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

const MESSAGES = [
  { time: 0, text: "Loading..." },
  { time: 4000, text: "Still loading... the server may be waking up (free tier Render)" },
  { time: 10000, text: "Almost there — Render free tier can take up to 60s on first request" },
];

export function RenderLoadingIndicator() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState(MESSAGES[0].text);
  const [isVisible, setIsVisible] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    let mounted = true;

    const checkLoading = () => {
      if (!mounted) return;
      
      const queries = queryClient.getQueryCache().getAll();
      const anyLoading = queries.some(q => q.state.fetchStatus === "fetching");
      setIsVisible(anyLoading);
    };

    checkLoading();

    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (!mounted) return;
      if (event?.type === "added" || event?.type === "updated") {
        checkLoading();
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [queryClient]);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (!isVisible) {
      setMessage(MESSAGES[0].text);
      return;
    }

    timersRef.current = MESSAGES.map(m =>
      setTimeout(() => setMessage(m.text), m.time)
    );

    return () => timersRef.current.forEach(clearTimeout);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-primary dark:bg-primary-foreground text-primary-foreground dark:text-primary px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}