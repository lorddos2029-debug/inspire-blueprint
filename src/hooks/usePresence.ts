import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "presence_session_id";

const getSessionId = () => {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
};

const extractProductId = (pathname: string): string | null => {
  const m = pathname.match(/^\/produto\/([^\/?#]+)/);
  return m ? m[1] : null;
};

export const usePresence = () => {
  const location = useLocation();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const sessionId = getSessionId();
    const ping = async () => {
      try {
        const payload = {
          session_id: sessionId,
          last_seen: new Date().toISOString(),
          page: location.pathname,
          product_id: extractProductId(location.pathname),
          user_agent: navigator.userAgent.slice(0, 500),
        };
        await supabase.from("live_sessions").upsert(payload as any, { onConflict: "session_id" });
      } catch (e) {
        // silent
      }
    };

    ping();
    intervalRef.current = window.setInterval(ping, 30000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [location.pathname]);
};
