"use client";

type Finding = {
  severity: string;
  status: string;
};

const WEIGHTS: Record<string, number> = {
  critical: 25,
  high: 12,
  medium: 5,
  low: 1,
  info: 1,
};

function computeScore(findings: Finding[]): { score: number; grade: string } {
  const open = findings.filter((f) => f.status === "open" || !f.status);
  let score = 100;

  for (const f of open) {
    score -= WEIGHTS[f.severity] ?? 1;
  }

  score = Math.max(0, Math.min(100, score));

  let grade = "F";
  if (score >= 90) grade = "A";
  else if (score >= 75) grade = "B";
  else if (score >= 60) grade = "C";
  else if (score >= 40) grade = "D";

  return { score, grade };
}

const GRADE_COLOR: Record<string, string> = {
  A: "text-brand border-brand/40",
  B: "text-brand border-brand/40",
  C: "text-yellow-400 border-yellow-400/40",
  D: "text-orange-400 border-orange-400/40",
  F: "text-red-400 border-red-400/40",
};

export default function SecurityScore({ findings }: { findings: Finding[] }) {
  const { score, grade } = computeScore(findings);

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-panel p-5">
      <div
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 font-display text-2xl font-medium ${GRADE_COLOR[grade]}`}
      >
        {grade}
      </div>
      <div>
        <p className="text-xs text-muted">Security score</p>
        <p className="font-display text-xl font-medium">{score} / 100</p>
        <p className="mt-0.5 text-xs text-muted">
          Based on open findings, weighted by severity.
        </p>
      </div>
    </div>
  );
}













































































































































































































































































































































































































