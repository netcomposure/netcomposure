"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function SettingsPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setUserId(data.user?.id ?? null);
      setCreatedAt(data.user?.created_at ?? null);
    });
  }, []);

  const avatarUrl = userId
    ? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${userId}&backgroundColor=3ecf8e`
    : null;

  return (
    <div>
      <h1 className="font-display text-2xl font-medium">Settings</h1>
      <p className="mt-1 text-sm text-muted">Your account details.</p>

      <section className="mt-8 rounded-lg border border-line bg-panel p-6">
        <div className="flex items-center gap-4">
          {avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt="Profile avatar"
              className="h-16 w-16 rounded-full bg-ink"
            />
          )}
          <div>
            <p className="font-display text-lg font-medium">{email}</p>
            <p className="mt-1 text-xs text-muted">
              Member since{" "}
              {createdAt ? new Date(createdAt).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted">Plan</p>
            <p className="mt-1 text-sm">Free</p>
          </div>
          <div>
            <p className="text-xs text-muted">User ID</p>
            <p className="mt-1 break-all font-mono text-xs text-muted">
              {userId}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}