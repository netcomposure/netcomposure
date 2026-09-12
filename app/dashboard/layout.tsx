"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "API Reference", href: "/docs", icon: BookOpen },
  { label: "Settings", href: "/settings", icon: Settings },
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
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setUserId(data.user?.id ?? null);
    });

    const stored = localStorage.getItem("nc_sidebar_collapsed");
    if (stored === "true") setCollapsed(true);
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

  function toggleCollapsed() {
    setCollapsed((prev) => {
      localStorage.setItem("nc_sidebar_collapsed", String(!prev));
      return !prev;
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  const avatarUrl = userId
    ? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${userId}&backgroundColor=3ecf8e`
    : null;

  return (
    <div className="flex min-h-screen">
      <aside
        className={`hidden shrink-0 flex-col border-r border-line bg-panel transition-all duration-200 md:flex ${
          collapsed ? "w-[68px]" : "w-60"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-line px-4 py-4">
          <ShieldCheck className="h-6 w-6 shrink-0 text-brand" />
          {!collapsed && (
            <span className="font-display text-sm font-medium">Net Composure</span>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4 text-sm">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                  active
                    ? "bg-panel-raised text-brand"
                    : "text-muted hover:bg-panel-raised hover:text-text"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={toggleCollapsed}
          className="flex items-center gap-3 border-t border-line px-3 py-4 text-sm text-muted hover:text-text"
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronsLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-line px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />
            All systems operational
          </div>

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
              <span className="hidden text-sm sm:inline">{email}</span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-lg border border-line bg-panel p-2 shadow-2xl shadow-black/50">
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
                    <p className="truncate text-sm font-medium text-text">
                      {email}
                    </p>
                    <p className="text-xs text-muted">Net Composure account</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-panel-raised"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="px-8 py-10">{children}</div>
      </div>
    </div>
  );
}