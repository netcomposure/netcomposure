"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FolderKanban,
  KeyRound,
  ShieldAlert,
  Sparkles,
  Plus,
  Shield,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type Project = {
  id: string;
  name: string;
  created_at: string;
  plan: string;
};

type ApiKey = {
  id: string;
  project_id: string;
  revoked: boolean;
};

const TILE_COLORS = [
  "from-brand/30 to-brand/5",
  "from-blue-400/30 to-blue-400/5",
  "from-purple-400/30 to-purple-400/5",
  "from-orange-400/30 to-orange-400/5",
  "from-pink-400/30 to-pink-400/5",
  "from-teal-400/30 to-teal-400/5",
];

function tileColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash += id.charCodeAt(i);
  return TILE_COLORS[hash % TILE_COLORS.length];
}

export default function DashboardPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  const [projects, setProjects] = useState<Project[]>([]);
  const [keysByProject, setKeysByProject] = useState<Record<string, ApiKey[]>>({});
  const [findingsCount, setFindingsCount] = useState(0);
  const [newProjectName, setNewProjectName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace("/login");
        return;
      }
      setChecking(false);
      await loadProjects();
    });
  }, [router]);

  async function loadProjects() {
    const { data: projectRows, error: projectError } = await supabase
      .from("projects")
      .select("id, name, created_at, plan")
      .order("created_at", { ascending: false });

    if (projectError) {
      setError(projectError.message);
      return;
    }

    setProjects(projectRows ?? []);

    const { data: keyRows, error: keyError } = await supabase
      .from("api_keys")
      .select("id, project_id, revoked");

    if (keyError) {
      setError(keyError.message);
      return;
    }

    const grouped: Record<string, ApiKey[]> = {};
    for (const row of keyRows ?? []) {
      if (!grouped[row.project_id]) grouped[row.project_id] = [];
      grouped[row.project_id].push(row);
    }
    setKeysByProject(grouped);

    const { count, error: findingsError } = await supabase
      .from("findings")
      .select("id", { count: "exact", head: true });

    if (!findingsError) {
      setFindingsCount(count ?? 0);
    }
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!newProjectName.trim()) return;

    setCreating(true);
    const { data: userData } = await supabase.auth.getUser();
    const { error: insertError } = await supabase.from("projects").insert({
      name: newProjectName.trim(),
      owner: userData.user?.id,
    });
    setCreating(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setNewProjectName("");
    setShowCreate(false);
    await loadProjects();
  }

  if (checking) {
    return null;
  }

  const totalKeys = Object.values(keysByProject).flat();
  const activeKeys = totalKeys.filter((k) => !k.revoked).length;

  return (
    <div className="flex-1 overflow-y-auto px-8 py-10">
      <h1 className="font-display text-2xl font-medium">Overview</h1>
      <p className="mt-1 text-sm text-muted">Your projects and API keys.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-panel p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">Projects</p>
            <FolderKanban className="h-4 w-4 text-muted" />
          </div>
          <p className="mt-2 font-display text-2xl font-medium">
            {projects.length}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-panel p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">Active API keys</p>
            <KeyRound className="h-4 w-4 text-muted" />
          </div>
          <p className="mt-2 font-display text-2xl font-medium">
            {activeKeys}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-panel p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">Findings</p>
            <ShieldAlert className="h-4 w-4 text-muted" />
          </div>
          <p className="mt-2 font-display text-2xl font-medium">
            {findingsCount}
          </p>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-lg font-medium">Your projects</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-medium text-ink hover:bg-brand-dim"
        >
          <Plus className="h-3.5 w-3.5" />
          New project
        </button>
      </div>

      {projects.length === 0 && (
        <p className="mt-4 text-sm text-muted">
          No projects yet — tap &quot;New project&quot; to get your first API key.
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {projects.map((project) => {
          const keys = keysByProject[project.id] ?? [];
          const activeCount = keys.filter((k) => !k.revoked).length;
          const isPremium = project.plan === "premium";
          return (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="group flex flex-col items-center gap-2.5"
            >
              <div
                className={`relative flex h-20 w-20 items-center justify-center rounded-[22px] border border-line bg-gradient-to-br ${tileColor(
                  project.id
                )} shadow-lg shadow-black/20 transition-transform group-hover:scale-105 group-active:scale-95`}
              >
                <Shield className="h-8 w-8 text-text/80" strokeWidth={1.5} />
                {isPremium && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-line bg-panel">
                    <Sparkles className="h-2.5 w-2.5 text-brand" />
                  </span>
                )}
                {activeCount > 0 && (
                  <span className="absolute -bottom-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-medium text-ink">
                    {activeCount}
                  </span>
                )}
              </div>
              <span className="max-w-[6.5rem] truncate text-center text-xs text-text">
                {project.name}
              </span>
            </Link>
          );
        })}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-panel p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-medium">New project</h3>
              <button
                onClick={() => setShowCreate(false)}
                className="text-muted hover:text-text"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="mt-5 flex flex-col gap-4">
              <input
                type="text"
                autoFocus
                placeholder="e.g. My Blog Backend"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="rounded-md border border-line bg-ink px-3 py-2.5 text-sm outline-none focus:border-brand"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={creating}
                className="rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-ink hover:bg-brand-dim disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create project"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}