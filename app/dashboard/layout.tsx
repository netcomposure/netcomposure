"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  CreditCard,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Docs", href: "/docs", icon: BookOpen },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setUserId(data.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  const avatarUrl = userId
    ? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${userId}&backgroundColor=3ecf8e`
    : null;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-ink">
      <header className="flex shrink-0 items-center justify-between border-b border-line px-6 py-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-brand" />
          <span className="font-display text-sm font-medium">Net Composure</span>
        </div>

        <nav className="flex items-center gap-1 rounded-full border border-line bg-panel p-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-brand text-ink"
                    : "text-muted hover:text-text"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full border border-line p-1 pr-3 hover:border-white/20"
          >
            {avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="Profile avatar"
                className="h-7 w-7 rounded-full bg-ink"
              />
            )}
            <span className="hidden text-xs sm:inline">{email}</span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-lg border border-line bg-panel p-2 shadow-2xl shadow-black/50">
              <div className="flex items-center gap-3 border-b border-line px-3 py-3">
                {avatarUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="Profile avatar"
                    className="h-10 w-10 rounded-full bg-ink"
                  />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text">{email}</p>
                  <span className="mt-1 inline-block rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                    Free plan
                  </span>
                </div>
              </div>

              <Link
                href="/dashboard/settings"
                onClick={() => setProfileOpen(false)}
                className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-text hover:bg-panel-raised"
              >
                <Settings className="h-4 w-4" />
                Account settings
              </Link>
              <Link
                href="/dashboard/billing"
                onClick={() => setProfileOpen(false)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-brand hover:bg-panel-raised"
              >
                <CreditCard className="h-4 w-4" />
                Upgrade to Premium
              </Link>
              <button
                onClick={handleLogout}
                className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-panel-raised"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}