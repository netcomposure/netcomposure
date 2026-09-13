"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Project = {
  id: string;
  name: string;
  created_at: string;
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
      .select("id, name, created_at")
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
        <div className="log-line rounded-lg border border-line bg-panel p-5">
          <p className="text-xs text-muted">Projects</p>
          <p className="mt-1 font-display text-2xl font-medium">{projects.length}</p>
        </div>
        <div className="log-line rounded-lg border border-line bg-panel p-5">
          <p className="text-xs text-muted">Active API keys</p>
          <p className="mt-1 font-display text-2xl font-medium">{activeKeys}</p>
        </div>
        <div className="log-line rounded-lg border border-line bg-panel p-5">
          <p className="text-xs text-muted">Findings</p>
          <p className="mt-1 font-display text-2xl font-medium text-muted">—</p>
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

        <div className="mt-4 flex flex-col gap-3">
          {projects.map((project) => {
            const keys = keysByProject[project.id] ?? [];
            const activeCount = keys.filter((k) => !k.revoked).length;
            return (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="flex items-center justify-between rounded-lg border border-line bg-panel p-6 transition-colors hover:border-brand/40"
              >
                <div>
                  <h3 className="font-display text-base font-medium">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    {activeCount} active key{activeCount === 1 ? "" : "s"}
                  </p>
                </div>
                <span className="text-sm text-muted">→</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}