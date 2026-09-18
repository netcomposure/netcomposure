import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";

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
];

export default function PricingPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="text-sm text-muted hover:text-text">
          ← Back to home
        </Link>
        <h1 className="mt-4 font-display text-3xl font-medium">Pricing</h1>
        <p className="mt-3 text-muted">
          One flat rate per project — not per developer. Add teammates for
          free.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-line bg-panel p-6">
            <h2 className="font-display text-lg font-medium">Free</h2>
            <p className="mt-1 font-display text-2xl font-medium">$0</p>
            <ul className="mt-6 flex flex-col gap-3 text-sm">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span className="text-muted">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-brand/40 bg-panel p-6">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-medium">Premium</h2>
              <Sparkles className="h-4 w-4 text-brand" />
            </div>
            <p className="mt-1 font-display text-2xl font-medium">
              $9 <span className="text-sm font-normal text-muted">/ project / month</span>
            </p>
            <ul className="mt-6 flex flex-col gap-3 text-sm">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}