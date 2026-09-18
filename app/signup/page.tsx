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
    if (data.session) {
      router.push("/dashboard");
      return;
    }
    setCheckEmail(true);
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-8 sm:w-1/2 sm:px-16">
        <Link href="/" className="mb-10 flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-brand" />
          <span className="font-display text-lg font-medium">Net Composure</span>
        </Link>

        {checkEmail ? (
          <>
            <h1 className="font-display text-2xl font-medium">Check your email</h1>
            <p className="mt-3 text-sm text-muted">
              We sent a confirmation link to {email}. Click it to activate
              your account, then come back and log in.
            </p>
            <Link href="/login" className="mt-6 text-sm text-brand hover:underline">
              Back to log in
            </Link>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-medium">Create your account</h1>
            <p className="mt-2 text-sm text-muted">
              Start sending security events to Net Composure.
            </p>
            <form onSubmit={handleSubmit} className="mt-8 flex max-w-sm flex-col gap-4">
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
          </>
        )}
      </div>

      <div className="relative hidden overflow-hidden bg-panel sm:block sm:w-1/2">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative flex h-full flex-col items-center justify-center gap-8 px-10">
          <div className="rounded-lg border border-line bg-ink px-6 py-4 font-mono text-xs text-brand shadow-2xl shadow-black/40">
            <p>$ npm install netcomposure</p>
            <p className="mt-2 text-muted">✓ SDK connected</p>
            <p className="text-muted">✓ Firewall active</p>
            <p className="text-muted">✓ Watching for threats...</p>
          </div>
          <p className="max-w-xs text-center text-sm text-muted">
            Your app, guarded from the moment you connect it.
          </p>
        </div>
      </div>
    </div>
  );
}