"use client";

import { Check, X, Sparkles } from "lucide-react";

const FREE_FEATURES = [
  "Malware scanning (real threat database)",
  "Dependency vulnerability scanning",
  "Simple auto-remediation (auto-revoke on critical threats)",
  "Real-time request firewall",
  "Brute-force auto-blocking",
];

const PREMIUM_FEATURES = [
  "Everything in Free",
  "Smart auto-patch suggestions with exact fix versions",
  "Priority scanning and faster detection updates",
  "Extended findings history",
  "Priority support",
];

export default function BillingPage() {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-8">
      <h1 className="font-display text-2xl font-medium">Billing</h1>
      <p className="mt-1 text-sm text-muted">
        You&apos;re currently on the Free plan.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-line bg-panel p-6">
          <h2 className="font-display text-lg font-medium">Free</h2>
          <p className="mt-1 font-display text-2xl font-medium">$0</p>
          <p className="text-xs text-muted">forever</p>

          <ul className="mt-6 flex flex-col gap-3 text-sm">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span className="text-muted">{f}</span>
              </li>
            ))}
          </ul>

          <button
            disabled
            className="mt-6 w-full rounded-md border border-line px-4 py-2 text-sm text-muted"
          >
            Current plan
          </button>
        </div>

        <div className="rounded-lg border border-brand/40 bg-panel p-6">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-medium">Premium</h2>
            <Sparkles className="h-4 w-4 text-brand" />
          </div>
          <p className="mt-1 font-display text-2xl font-medium">
            $9 <span className="text-sm font-normal text-muted">/ project / month</span>
          </p>
          <p className="text-xs text-muted">unlimited projects, one flat rate</p>

          <ul className="mt-6 flex flex-col gap-3 text-sm">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <button className="mt-6 w-full rounded-md bg-brand px-4 py-2 text-sm font-medium text-ink hover:bg-brand-dim">
            Upgrade to Premium
          </button>
          <p className="mt-2 text-center text-xs text-muted">
            Payments coming soon — this is a preview of the Premium plan.
          </p>
        </div>
      </div>
    </div>
  );
}