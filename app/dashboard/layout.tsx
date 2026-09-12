"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard" },
  { label: "API Reference", href: "/docs" },
  { label: "Settings", href: "/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-panel md:flex">
        <div className="flex items-center gap-2 border-b border-line px-5 py-4">
          <span className="h-6 w-6 rounded-md bg-brand" />
          <span className="font-display text-sm font-medium">Net Composure</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-muted hover:bg-panel-raised hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-line px-5 py-4 text-xs text-muted">
          {email}
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-end gap-4 border-b border-line px-8 py-4">
          <button
            onClick={handleLogout}
            className="rounded-md border border-line px-4 py-2 text-sm text-text hover:border-white/20"
          >
            Log out
          </button>
        </header>
        <div className="px-8 py-10">{children}</div>
      </div>
    </div>
  );
}