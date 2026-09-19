"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type RangeKey = "1H" | "24H" | "7D" | "30D";

const RANGES: { key: RangeKey; label: string; ms: number; buckets: number }[] = [
  { key: "1H", label: "1H", ms: 60 * 60 * 1000, buckets: 30 },
  { key: "24H", label: "24H", ms: 24 * 60 * 60 * 1000, buckets: 24 },
  { key: "7D", label: "7D", ms: 7 * 24 * 60 * 60 * 1000, buckets: 28 },
  { key: "30D", label: "30D", ms: 30 * 24 * 60 * 60 * 1000, buckets: 30 },
];

export default function ThreatActivityChart({ projectId }: { projectId: string }) {
  const [range, setRange] = useState<RangeKey>("24H");
  const [points, setPoints] = useState<number[]>([]);
  const [pulse, setPulse] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const cfg = RANGES.find((r) => r.key === range)!;
      const since = new Date(Date.now() - cfg.ms).toISOString();

      const [activity, findings, blocked] = await Promise.all([
        supabase.from("api_activity").select("created_at").eq("project_id", projectId).gte("created_at", since),
        supabase.from("findings").select("created_at").eq("project_id", projectId).gte("created_at", since),
        supabase.from("blocked_ips").select("created_at").eq("project_id", projectId).gte("created_at", since),
      ]);

      const events = [
        ...(activity.data ?? []),
        ...(findings.data ?? []),
        ...(blocked.data ?? []),
      ];

      const bucketMs = cfg.ms / cfg.buckets;
      const now = Date.now();
      const buckets = Array.from({ length: cfg.buckets }, (_, i) => {
        const start = now - (cfg.buckets - i) * bucketMs;
        const end = start + bucketMs;
        return events.filter((e) => {
          const t = new Date(e.created_at).getTime();
          return t >= start && t < end;
        }).length;
      });

      if (!cancelled) {
        setPoints(buckets);
        setTotal(events.length);
      }
    }

    load();
    const interval = setInterval(load, 5000);
    const pulseInterval = setInterval(() => setPulse((p) => !p), 1200);
    return () => {
      cancelled = true;
      clearInterval(interval);
      clearInterval(pulseInterval);
    };
  }, [range, projectId]);

  const max = Math.max(1, ...points);
  const width = 560;
  const height = 140;
  const stepX = points.length > 1 ? width / (points.length - 1) : width;
  const coords = points.map((v, i) => ({
    x: i * stepX,
    y: height - (v / max) * (height - 20) - 10,
  }));
  const linePoints = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const last = coords[coords.length - 1];

  return (
    <div className="rounded-2xl border border-line bg-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-base font-medium">Threat Activity</h2>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <span
              className={`h-1.5 w-1.5 rounded-full bg-brand transition-opacity ${
                pulse ? "opacity-100" : "opacity-30"
              }`}
            />
            Live · {total} events
          </span>
          <div className="flex gap-1 rounded-full border border-line p-0.5">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  range === r.key ? "bg-brand text-ink" : "text-muted hover:text-text"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 w-full" preserveAspectRatio="none">
        <polyline
          points={linePoints}
          fill="none"
          stroke="#3ecf8e"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polyline
          points={`0,${height} ${linePoints} ${width},${height}`}
          fill="rgba(62,207,142,0.08)"
          stroke="none"
        />
        {last && (
          <circle
            cx={last.x}
            cy={last.y}
            r={pulse ? 5 : 3.5}
            fill="#3ecf8e"
            style={{ transition: "r 0.6s ease" }}
          />
        )}
      </svg>
    </div>
  );
}