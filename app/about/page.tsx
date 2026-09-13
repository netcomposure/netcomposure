import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm text-muted hover:text-text">
        ← Back to home
      </Link>
      <h1 className="mt-4 font-display text-3xl font-medium">About</h1>
      <p className="mt-4 text-muted">
        Net Composure is built for indie developers and small teams —
        security tooling shouldn&apos;t punish you for having teammates,
        or bury its best features behind an enterprise sales call.
      </p>
    </main>
  );
}