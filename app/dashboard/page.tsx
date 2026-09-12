"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Project = {
  id: string;
  name: string;
  created_at: string;
};

type ApiKey = {
  id: string;
  project_id: string;
  key: string;
  created_at: string;
  revoked: boolean;
};

function generateApiKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `nc_live_${hex}`;
}

function maskKey(key: string): string {
  return `nc_live_${"•".repeat(10)}${key.slice(-4)}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  const [projects, setProjects] = useState<Project[]>([]);
  const [keysByProject, setKeysByProject] = useState<Record<string, ApiKey[]>>({});
  const [newProjectName, setNewProjectName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealedKey, setRevealedKey] = useState<{ projectId: string; key: string } | null>(null);

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
      .select("id, project_id, key, created_at, revoked")
      .order("created_at", { ascending: false });

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

  async function handleGenerateKey(projectId: string) {
    setError(null);
    const newKey = generateApiKey();

    const { error: insertError } = await supabase.from("api_keys").insert({
      project_id: projectId,
      key: newKey,
    });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setRevealedKey({ projectId, key: newKey });
    await loadProjects();
  }

  if (checking) {
    return null;
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-medium">Overview</h1>
      <p className="mt-1 text-sm text-muted">Your projects and API keys.</p>

      <section className="mt-8 rounded-lg border border-line bg-panel p-6">
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

        <div className="mt-4 flex flex-col gap-4">
          {projects.map((project) => {
            const keys = keysByProject[project.id] ?? [];
            return (
              <div
                key={project.id}
                className="rounded-lg border border-line bg-panel p-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-medium">
                    {project.name}
                  </h3>
                  <button
                    onClick={() => handleGenerateKey(project.id)}
                    className="rounded-md border border-line px-3 py-1.5 text-xs text-text hover:border-brand hover:text-brand"
                  >
                    Generate API key
                  </button>
                </div>

                {revealedKey && revealedKey.projectId === project.id && (
                  <div className="mt-4 rounded-md border border-brand/40 bg-ink px-4 py-3">
                    <p className="text-xs text-brand">
                      Copy this now — you won&apos;t see the full key again.
                    </p>
                    <p className="mt-1 select-all break-all font-mono text-sm">
                      {revealedKey.key}
                    </p>
                  </div>
                )}

                {keys.length > 0 && (
                  <ul className="mt-4 flex flex-col gap-2">
                    {keys.map((k) => (
                      <li
                        key={k.id}
                        className="flex items-center justify-between font-mono text-xs text-muted"
                      >
                        <span>{maskKey(k.key)}</span>
                        <span>
                          {new Date(k.created_at).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}