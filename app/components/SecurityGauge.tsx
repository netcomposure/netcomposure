"use client";

const WEIGHTS: Record<string, number> = {
  critical: 25,
  high: 12,
  medium: 5,
  low: 1,
  info: 1,
};

function computeScore(findings: { severity: string; status: string }[]) {
  const open = findings.filter((f) => f.status === "open" || !f.status);
  let score = 100;
  for (const f of open) score -= WEIGHTS[f.severity] ?? 1;
  return Math.max(0, Math.min(100, score));
}

export default function SecurityGauge({
  findings,
}: {
  findings: { severity: string; status: string }[];
}) {
  const score = computeScore(findings);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#3ecf8e" : score >= 40 ? "#facc15" : "#f87171";

  const label = score >= 90 ? "Protected" : score >= 60 ? "Needs attention" : "At risk";

  return (
    <div className="rounded-2xl border border-line bg-panel p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-medium">Security Score</h2>
      </div>
      <div className="mt-4 flex items-center gap-6">
        <svg width="130" height="130" viewBox="0 0 130 130" className="shrink-0">
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="10"
          />
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 65 65)"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
          <text
            x="65"
            y="60"
            textAnchor="middle"
            className="font-display"
            fontSize="28"
            fill="#eaefec"
          >
            {score}
          </text>
          <text x="65" y="80" textAnchor="middle" fontSize="11" fill="#8b9691">
            / 100
          </text>
        </svg>
        <div>
          <p className="font-display text-lg font-medium" style={{ color }}>
            {label}
          </p>
          <p className="mt-1 max-w-[14rem] text-sm text-muted">
            {score >= 90
              ? "Your project is well protected. Keep monitoring for new threats."
              : score >= 60
              ? "Some open findings need review — check the list below."
              : "Multiple serious findings are open. Review and remediate soon."}
          </p>
        </div>
      </div>
    </div>
  );
}