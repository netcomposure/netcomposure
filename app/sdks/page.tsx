import Link from "next/link";

export default function SdksPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm text-muted hover:text-text">
        ← Back to home
      </Link>
      <h1 className="mt-4 font-display text-3xl font-medium">SDKs</h1>
      <p className="mt-4 text-muted">
        Official SDKs for Node.js and Python are on the way. In the
        meantime, integrate directly with the REST API — see the{" "}
        <Link href="/docs" className="text-brand hover:underline">
          integration guide
        </Link>
        .
      </p>
    </main>
  );
}