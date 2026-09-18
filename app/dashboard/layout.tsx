"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  ShieldAlert,
  Radar,
  Ban,
  KeyRound,
  ScrollText,
  FileBarChart,
  Puzzle,
  Settings,
  Bell,
  ChevronDown,
  Sparkles,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard#overview", icon: LayoutDashboard, active: true },
  { label: "Security Findings", href: "/dashboard#findings", icon: ShieldAlert, active: true },
  { label: "Live Threats", href: "/dashboard#activity", icon: Radar, active: true },
  { label: "Active Defense", href: "/dashboard#defense", icon: Ban, active: true },
  { label: "API Keys", href: "/dashboard#keys", icon: KeyRound, active: true },
  { label: "Events & Logs", href: "#", icon: ScrollText, active: false },
  { label: "Reports", href: "#", icon: FileBarChart, active: false },
  { label: "Integrations", href: "/sdks", icon: Puzzle, active: true },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, active: true },
];

type Project = { id: string; name: string; plan: string };

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const projectMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setUserId(data.user?.id ?? null);
    });

    supabase
      .from("projects")
      .select("id, name, plan")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        setProjects(data);

        const params = new URLSearchParams(window.location.search);
        const fromUrl = params.get("project");
        const found = data.find((p) => p.id === fromUrl);
        setSelectedProject(found ?? data[0]);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (
        projectMenuRef.current &&
        !projectMenuRef.current.contains(e.target as Node)
      ) {
        setProjectMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectProject(project: Project) {
    setSelectedProject(project);
    setProjectMenuOpen(false);
    router.push(`/dashboard?project=${project.id}`);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  const avatarUrl = userId
    ? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${userId}&backgroundColor=3ecf8e`
    : null;

  return (
    <div className="flex h-screen overflow-hidden bg-ink">
      <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-panel">
        <div className="flex items-center gap-2 border-b border-line px-5 py-4">
          <ShieldCheck className="h-6 w-6 text-brand" />
          <span className="font-display text-sm font-medium">Net Composure</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4 text-sm">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            if (!item.active) {
              return (
                <span
                  key={item.label}
                  className="flex cursor-default items-center gap-3 rounded-md px-3 py-2 text-muted/50"
                  title="Coming soon"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </span>
              );
            }
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-muted transition-colors hover:bg-panel-raised hover:text-text"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {selectedProject?.plan !== "premium" && (
          <div className="m-3 rounded-lg border border-brand/30 bg-brand/5 p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-brand">
              <Sparkles className="h-3.5 w-3.5" />
              Premium
            </div>
            <p className="mt-1.5 text-xs text-muted">
              Unlock smart auto-patch suggestions and more.
            </p>
            <Link
              href="/dashboard/billing"
              className="mt-2 block rounded-md bg-brand py-1.5 text-center text-xs font-medium text-ink hover:bg-brand-dim"
            >
              Upgrade
            </Link>
          </div>
        )}

        <div className="border-t border-line px-5 py-3 text-[11px] text-muted">
          Net Composure v0.1.0
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-line px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="relative" ref={projectMenuRef}>
              <button
                onClick={() => setProjectMenuOpen((p) => !p)}
                className="flex items-center gap-2 rounded-md border border-line bg-panel px-3 py-1.5 text-sm hover:border-white/20"
              >
                <span>{selectedProject?.name ?? "Select project"}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted" />
              </button>
              {projectMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-lg border border-line bg-panel p-1 shadow-2xl shadow-black/50">
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => selectProject(p)}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-panel-raised ${
                        selectedProject?.id === p.id ? "text-brand" : "text-text"
                      }`}
                    >
                      {p.name}
                      {p.plan === "premium" && (
                        <Sparkles className="h-3 w-3 text-brand" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wide ${
                selectedProject?.plan === "premium"
                  ? "border-brand/40 text-brand"
                  : "border-line text-muted"
              }`}
            >
              {selectedProject?.plan === "premium" ? "Premium" : "Free"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              All systems operational
            </div>
            <button className="text-muted hover:text-text">
              <Bell className="h-4 w-4" />
            </button>

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
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}