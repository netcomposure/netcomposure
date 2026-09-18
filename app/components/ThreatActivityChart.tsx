"use client";

import { useEffect, useState } from "react";

type Event = { created_at: string };

export default function ThreatActivityChart({
  findings,
  blockedIps,
}: {
  findings: Event[];
  blockedIps: Event[];
}) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => !p), 1500);
    return () => clearInterval(id);
  }, []);

  const now = Date.now();
  const buckets = Array.from({ length: 24 }, (_, i) => {
    const hourStart = now - (23 - i) * 60 * 60 * 1000;
    const hourEnd = hourStart + 60 * 60 * 1000;
    return (
      findings.filter((f) => {
        const t = new Date(f.created_at).getTime();
        return t >= hourStart && t < hourEnd;
      }).length +
      blockedIps.filter((b) => {
        const t = new Date(b.created_at).getTime();
        return t >= hourStart && t < hourEnd;
      }).length
    );
  });

  const max = Math.max(1, ...buckets);
  const width = 560;
  const height = 140;
  const stepX = width / (buckets.length - 1);
  const points = buckets
    .map((v, i) => `${i * stepX},${height - (v / max) * (height - 20) - 10}`)
    .join(" ");
  const total = findings.length + blockedIps.length;
  const lastX = (buckets.length - 1) * stepX;
  const lastY = height - (buckets[buckets.length - 1] / max) * (height - 20) - 10;

  return (
    <div className="rounded-2xl border border-line bg-panel p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-medium">Threat Activity (24h)</h2>
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <span
            className={`h-1.5 w-1.5 rounded-full bg-brand transition-opacity ${
              pulse ? "opacity-100" : "opacity-30"
            }`}
          />
          Live · {total} events
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 w-full" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke="#3ecf8e"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{ transition: "points 0.4s ease" }}
        />
        <polyline
          points={`0,${height} ${points} ${width},${height}`}
          fill="rgba(62,207,142,0.08)"
          stroke="none"
        />
        <circle
          cx={lastX}
          cy={lastY}
          r={pulse ? 5 : 3.5}
          fill="#3ecf8e"
          style={{ transition: "r 0.6s ease" }}
        />
      </svg>
    </div>
  );
}