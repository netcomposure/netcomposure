import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm text-muted hover:text-text">
        ← Back to home
      </Link>
      <h1 className="mt-4 font-display text-3xl font-medium">Contact</h1>
      <p className="mt-4 text-muted">
        Questions, feedback, or partnership inquiries — reach out any time.
      </p>
      <p className="mt-6 text-sm text-brand">hello@netcomposure.dev</p>
    </main>
  );
}