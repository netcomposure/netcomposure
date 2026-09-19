"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  KeyRound,
  Ban,
  Zap,
  FileCode2,
  ScanLine,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import GenerateFix from "../components/GenerateFix";
import SecurityGauge from "../components/SecurityGauge";
import ConnectionStatus from "../components/ConnectionStatus";
import ThreatActivityChart from "../components/ThreatActivityChart";

type Project = { id: string; name: string; created_at: string; plan: string };
type ApiKey = {
  id: string;
  project_id: string;
  key: string;
  created_at: string;
  revoked: boolean;
};
type Finding = {
  id: string;
  title: string;
  severity: string;
  status: string;
  detail: string | null;
  created_at: string;
};
type BlockedIp = { id: string; ip: string; reason: string | null; created_at: string };

function generateApiKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `nc_live_${hex}`;
}

function maskKey(key: string): string {
  return `nc_live_${"•".repeat(10)}${key.slice(-4)}`;
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const SEVERITY_BADGE: Record<string, string> = {
  critical: "bg-red-500/15 text-red-400",
  high: "bg-orange-500/15 text-orange-400",
  medium: "bg-yellow-500/15 text-yellow-400",
  low: "bg-brand/15 text-brand",
  info: "bg-white/10 text-muted",
};

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [checking, setChecking] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [blockedIps, setBlockedIps] = useState<BlockedIp[]>([]);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace("/login");
        return;
      }
      setChecking(false);
      await loadProjects();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProjects() {
    const { data: rows, error: projectError } = await supabase
      .from("projects")
      .select("id, name, created_at, plan")
      .order("created_at", { ascending: false });

    if (projectError) {
      setError(projectError.message);
      return;
    }

    setProjects(rows ?? []);
    if (!rows || rows.length === 0) return;

    const fromUrl = searchParams.get("project");
    const found = rows.find((p) => p.id === fromUrl);
    const chosen = found ?? rows[0];
    setProject(chosen);
    await loadProjectData(chosen.id);
  }

  async function loadProjectData(projectId: string) {
    const { data: keyRows } = await supabase
      .from("api_keys")
      .select("id, project_id, key, created_at, revoked")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    setKeys(keyRows ?? []);

    const { data: findingRows } = await supabase
      .from("findings")
      .select("id, title, severity, status, detail, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    setFindings(findingRows ?? []);

    const { data: blockedRows } = await supabase
      .from("blocked_ips")
      .select("id, ip, reason, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    setBlockedIps(blockedRows ?? []);
  }

  useEffect(() => {
    const paramId = searchParams.get("project");
    if (!paramId || !projects.length) return;
    const found = projects.find((p) => p.id === paramId);
    if (found && found.id !== project?.id) {
      setProject(found);
      loadProjectData(found.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, projects]);

  async function handleGenerateKey() {
    if (!project) return;
    setError(null);
    setGenerating(true);
    const newKey = generateApiKey();
    const { error: insertError } = await supabase
      .from("api_keys")
      .insert({ project_id: project.id, key: newKey });
    setGenerating(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setRevealedKey(newKey);
    await loadProjectData(project.id);
  }

  async function handleRevokeKey(keyId: string) {
    if (!project) return;
    await supabase.from("api_keys").update({ revoked: true }).eq("id", keyId);
    await loadProjectData(project.id);
  }

  async function handleUpgrade() {
    if (!project) return;
    setUpgrading(true);
    await supabase.from("projects").update({ plan: "premium" }).eq("id", project.id);
    setUpgrading(false);
    await loadProjects();
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    setCreating(true);
    const { data: userData } = await supabase.auth.getUser();
    await supabase
      .from("projects")
      .insert({ name: newProjectName.trim(), owner: userData.user?.id });
    setCreating(false);
    setNewProjectName("");
    setShowCreate(false);
    await loadProjects();
  }

  if (checking) return null;

  if (!project) {
    return (
      <div className="flex-1 overflow-y-auto px-8 py-10">
        <h1 className="font-display text-2xl font-medium">Welcome to Net Composure</h1>
        <p className="mt-2 text-sm text-muted">
          Create your first project to get started.
        </p>
        <form onSubmit={handleCreateProject} className="mt-6 flex max-w-md gap-3">
          <input
            type="text"
            placeholder="e.g. My Blog Backend"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="flex-1 rounded-md border border-line bg-panel px-3 py-2.5 text-sm outline-none focus:border-brand"
          />
          <button
            type="submit"
            disabled={creating}
            className="rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-ink hover:bg-brand-dim disabled:opacity-60"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    );
  }

  const isPremium = project.plan === "premium";
  const openFindings = findings.filter((f) => f.status === "open" || !f.status);
  const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
  openFindings.forEach((f) => {
    if (f.severity in severityCounts) {
      severityCounts[f.severity as keyof typeof severityCounts] += 1;
    }
  });

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8">
      <div id="overview" className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">
            Here&apos;s what&apos;s happening with {project.name} today.
          </p>
          <div className="mt-2">
            <ConnectionStatus projectId={project.id} />
          </div>
        </div>
        <div className="mt-3 flex gap-3 sm:mt-0">
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-xs text-muted hover:border-white/20"
          >
            <Plus className="h-3.5 w-3.5" />
            New project
          </button>
          {!isPremium && (
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="flex items-center gap-1.5 rounded-md border border-brand/40 px-4 py-2 text-sm text-brand hover:bg-brand/10 disabled:opacity-60"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {upgrading ? "Upgrading..." : "Upgrade"}
            </button>
          )}
          <button
            onClick={handleGenerateKey}
            disabled={generating}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-ink hover:bg-brand-dim disabled:opacity-60"
          >
            {generating ? "Generating..." : "Generate API key"}
          </button>
        </div>
      </div>

      {revealedKey && (
        <div className="mt-4 rounded-md border border-brand/40 bg-panel px-4 py-3">
          <p className="text-xs text-brand">Copy this now — you won&apos;t see the full key again.</p>
          <p className="mt-1 select-all break-all font-mono text-sm">{revealedKey}</p>
        </div>
      )}

      <div id="activity" className="mt-6 grid gap-5 lg:grid-cols-3">
        <SecurityGauge findings={findings} />
        <div className="lg:col-span-2">
          <ThreatActivityChart projectId={project.id} />
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-line bg-panel p-6">
        <h2 className="font-display text-base font-medium">Security Overview</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <span className="h-2 w-2 rounded-full bg-red-400" /> Critical
            </div>
            <p className="mt-1 font-display text-xl font-medium">{severityCounts.critical}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <span className="h-2 w-2 rounded-full bg-orange-400" /> High
            </div>
            <p className="mt-1 font-display text-xl font-medium">{severityCounts.high}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <span className="h-2 w-2 rounded-full bg-yellow-400" /> Medium
            </div>
            <p className="mt-1 font-display text-xl font-medium">{severityCounts.medium}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <span className="h-2 w-2 rounded-full bg-brand" /> Blocked IPs
            </div>
            <p className="mt-1 font-display text-xl font-medium">{blockedIps.length}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div id="findings" className="rounded-2xl border border-line bg-panel p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-medium">Recent Findings</h2>
            <span className="text-xs text-muted">{findings.length} total</span>
          </div>
          {findings.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              No findings yet — connect your API key and run a scan to see results here.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col gap-2">
              {findings.slice(0, 8).map((f) => (
                <li
                  key={f.id}
                  className="flex flex-col gap-2 rounded-md border border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                        SEVERITY_BADGE[f.severity] ?? SEVERITY_BADGE.info
                      }`}
                    >
                      {f.severity}
                    </span>
                    <span className="text-sm">{f.title}</span>
                  </div>
                  <span className="text-xs text-muted">{timeAgo(f.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
          {findings.some(
            (f) => f.title.startsWith("Premium: Smart patch suggestion") && f.detail
          ) && (
            <div className="mt-4 border-t border-line pt-4">
              {findings
                .filter((f) => f.title.startsWith("Premium: Smart patch suggestion") && f.detail)
                .slice(0, 1)
                .map((f) => <GenerateFix key={f.id} detail={f.detail as string} />)}
            </div>
          )}
        </div>

        <div id="defense" className="rounded-2xl border border-line bg-panel p-6">
          <div className="flex items-center gap-2">
            <Ban className="h-4 w-4 text-muted" />
            <h2 className="font-display text-base font-medium">Active Defense</h2>
          </div>
          <p className="mt-1 text-xs text-muted">
            {blockedIps.length} IP{blockedIps.length === 1 ? "" : "s"} blocked automatically.
          </p>
          {blockedIps.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No blocked IPs yet.</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-2">
              {blockedIps.slice(0, 6).map((b) => (
                <li key={b.id} className="flex items-center justify-between text-xs">
                  <span className="font-mono text-text">{b.ip}</span>
                  <span className="text-muted">{timeAgo(b.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex items-center justify-between rounded-md border border-dashed border-line px-3 py-2.5">
            <div className="flex items-center gap-2 text-xs text-muted">
              <Sparkles className="h-3.5 w-3.5" />
              Smart auto-patch
            </div>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] uppercase ${
                isPremium ? "border-brand/40 text-brand" : "border-line text-muted"
              }`}
            >
              {isPremium ? "Active" : "Premium"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div id="keys" className="rounded-2xl border border-line bg-panel p-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-muted" />
            <h2 className="font-display text-base font-medium">API Keys</h2>
          </div>
          {keys.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No keys yet — generate one above.</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-2">
              {keys.map((k) => (
                <li
                  key={k.id}
                  className="flex items-center justify-between rounded-md border border-line px-4 py-3"
                >
                  <div>
                    <p className="font-mono text-sm">{maskKey(k.key)}</p>
                    <p className="mt-1 text-xs text-muted">
                      Created {new Date(k.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {k.revoked ? (
                    <span className="text-xs text-red-400">Revoked</span>
                  ) : (
                    <button
                      onClick={() => handleRevokeKey(k.id)}
                      className="rounded-md border border-line px-3 py-1.5 text-xs text-red-400 hover:border-red-400"
                    >
                      Revoke
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-line bg-panel p-6">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted" />
              <h2 className="font-display text-base font-medium">Quick Actions</h2>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={handleGenerateKey}
                className="flex items-center gap-2 rounded-md border border-line px-3 py-2.5 text-left text-sm hover:border-brand/40"
              >
                <KeyRound className="h-4 w-4 text-muted" />
                Generate API key
              </button>
              <Link
                href="/sdks"
                className="flex items-center gap-2 rounded-md border border-line px-3 py-2.5 text-left text-sm hover:border-brand/40"
              >
                <FileCode2 className="h-4 w-4 text-muted" />
                Connect SDK
              </Link>
              <Link
                href="/docs"
                className="flex items-center gap-2 rounded-md border border-line px-3 py-2.5 text-left text-sm hover:border-brand/40"
              >
                <ScanLine className="h-4 w-4 text-muted" />
                View integration guide
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-panel p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand" />
              <h2 className="font-display text-base font-medium">Protection Status</h2>
            </div>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              {["Malware scanning", "Dependency scanning", "Request firewall", "Brute-force defense"].map(
                (label) => (
                  <li key={label} className="flex items-center justify-between">
                    <span className="text-muted">{label}</span>
                    <span className="text-xs text-brand">Active</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-panel p-6">
            <h3 className="font-display text-lg font-medium">New project</h3>
            <form onSubmit={handleCreateProject} className="mt-5 flex flex-col gap-4">
              <input
                type="text"
                autoFocus
                placeholder="e.g. My Blog Backend"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="rounded-md border border-line bg-ink px-3 py-2.5 text-sm outline-none focus:border-brand"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 rounded-md border border-line px-4 py-2.5 text-sm text-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-ink hover:bg-brand-dim disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}