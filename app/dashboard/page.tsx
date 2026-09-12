"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
      } else {
        setEmail(data.session.user.email ?? null);
        setChecking(false);
      }
    });
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (checking) {
    return null;
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="rounded-md border border-line px-4 py-2 text-sm text-text hover:border-white/20"
        >
          Log out
        </button>
      </div>
      <p className="mt-2 text-sm text-muted">
        Logged in as {email}. Projects and findings will appear here soon.
      </p>
    </main>
  );
}