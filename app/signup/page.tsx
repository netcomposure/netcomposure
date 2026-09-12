"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // If Supabase already returned a live session, email confirmation
    // is off — the account is fully active right now, so go straight in.
    if (data.session) {
      router.push("/dashboard");
      return;
    }

    // Otherwise, confirmation is required before login will work.
    setCheckEmail(true);
  }

  if (checkEmail) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
        <h1 className="font-display text-2xl font-medium">Check your email</h1>
        <p className="mt-3 text-sm text-muted">
          We sent a confirmation link to {email}. Click it to activate your
          account, then come back and log in.
        </p>
        <Link href="/login" className="mt-6 text-sm text-brand hover:underline">
          Back to log in
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="font-display text-2xl font-medium">Create your account</h1>
      <p className="mt-2 text-sm text-muted">
        Start sending security events to Net Composure.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="text-sm text-muted">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-line bg-panel px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="text-sm text-muted">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-line bg-panel px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-ink hover:bg-brand-dim disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-brand hover:underline">
          Log in
        </Link>
      </p>
    </main>
  );
}