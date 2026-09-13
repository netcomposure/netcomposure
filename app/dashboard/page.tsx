"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FolderKanban, KeyRound, ShieldAlert, Sparkles } from "lucide-react";
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

export default function DashboardPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  const [projects, setProjects] = useState<Project[]>([]);
  const [keysByProject, setKeysByProject] = useState<Record<string, ApiKey[]>>({});
  const [findingsCount, setFindingsCount] = useState(0);
  const [newProjectName, setNewProjectName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    await loadProjects();
  }

  if (checking) {
    return null;
  }

  const totalKeys = Object.values(keysByProject).flat();
  const activeKeys = totalKeys.filter((k) => !k.revoked).length;

  return (
    <div>
      <h1 className="font-display text-2xl font-medium">Overview</h1>
      <p className="mt-1 text-sm text-muted">Your projects and API keys.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-line bg-panel p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">Projects</p>
            <FolderKanban className="h-4 w-4 text-muted" />
          </div>
          <p className="mt-2 font-display text-2xl font-medium">
            {projects.length}
          </p>
        </div>
        <div className="rounded-lg border border-line bg-panel p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">Active API keys</p>
            <KeyRound className="h-4 w-4 text-muted" />
          </div>
          <p className="mt-2 font-display text-2xl font-medium">
            {activeKeys}
          </p>
        </div>
        <div className="rounded-lg border border-line bg-panel p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">Findings</p>
            <ShieldAlert className="h-4 w-4 text-muted" />
          </div>
          <p className="mt-2 font-display text-2xl font-medium">
            {findingsCount}
          </p>
        </div>
      </div>

      <section className="mt-10 rounded-lg border border-line bg-panel p-6">
        <h2 className="font-display text-lg font-medium">Create a project</h2>
        <form onSubmit={handleCreateProject} className="mt-4 flex gap-3">
          <input
            type="text"
            placeholder="e.g. My Blog Backend"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="flex-1 rounded-md border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-brand"
          />
          <button
            type="submit"
            disabled={creating}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-ink hover:bg-brand-dim disabled:opacity-60"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg font-medium">Your projects</h2>

        {projects.length === 0 && (
          <p className="mt-3 text-sm text-muted">
            No projects yet — create one above to get your first API key.
          </p>
        )}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {projects.map((project) => {
            const keys = keysByProject[project.id] ?? [];
            const activeCount = keys.filter((k) => !k.revoked).length;
            const isPremium = project.plan === "premium";
            return (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="group flex flex-col justify-between rounded-lg border border-line bg-panel p-5 transition-colors hover:border-brand/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-base font-medium">
                      {project.name}
                    </h3>
                    <span
                      className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                        isPremium
                          ? "border-brand/40 text-brand"
                          : "border-line text-muted"
                      }`}
                    >
                      {isPremium && <Sparkles className="h-2.5 w-2.5" />}
                      {isPremium ? "Premium" : "Free"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {activeCount} active key{activeCount === 1 ? "" : "s"}
                  </p>
                </div>
                <p className="mt-4 text-xs text-muted group-hover:text-brand">
                  View project →
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}