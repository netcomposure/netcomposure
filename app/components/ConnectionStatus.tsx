"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ConnectionStatus({ projectId }: { projectId: string }) {
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const { data } = await supabase
        .from("api_activity")
        .select("created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!cancelled) {
        setLastSeen(data?.[0]?.created_at ?? null);
        setChecked(true);
      }
    }

    check();
    const interval = setInterval(check, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [projectId]);

  if (!checked) return null;

  const isLive = lastSeen && Date.now() - new Date(lastSeen).getTime() < 2 * 60 * 1000;

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isLive ? "animate-pulse bg-brand" : lastSeen ? "bg-yellow-400" : "bg-muted"
        }`}
      />
      <span className={isLive ? "text-brand" : "text-muted"}>
        {isLive
          ? "Connected — live"
          : lastSeen
          ? `Last seen ${new Date(lastSeen).toLocaleTimeString()}`
          : "Waiting for connection..."}
      </span>
    </div>
  );
}