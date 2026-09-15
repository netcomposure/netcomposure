"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, KeyRound, ShieldAlert, Ban } from "lucide-react";
import { supabase } from "../../../../lib/supabase";

type Project = {
  id: string;
  name: string;
  created_at: string;
  plan: string;
};

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

type BlockedIp = {
  id: string;
  ip: string;
  reason: string | null;
  created_at: string;
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

const SEVERITY_COLOR: Record<string, string> = {
  critical: "text-red-400 border-red-400/40",
  high: "text-orange-400 border-orange-400/40",
  medium: "text-yellow-400 border-yellow-400/40",
  low: "text-brand border-brand/40",
  info: "text-muted border-line",
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [blockedIps, setBlockedIps] = useState<BlockedIp[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function loadData() {
    setLoading(true);
    setError(null);

    const { data: projectRow, error: projectError } = await supabase
      .from("projects")
      .select("id, name, created_at, plan")
      .eq("id", projectId)
      .single();

    if (projectError || !projectRow) {
      setError("Project not found, or you don't have access to it.");
      setLoading(false);
      return;
    }

    setProject(projectRow);

    const { data: keyRows, error: keyError } = await supabase
      .from("api_keys")
      .select("id, project_id, key, created_at, revoked")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (keyError) {
      setError(keyError.message);
      setLoading(false);
      return;
    }

    setKeys(keyRows ?? []);

    const { data: findingRows, error: findingError } = await supabase
      .from("findings")
      .select("id, title, severity, status, detail, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (findingError) {
      setError(findingError.message);
      setLoading(false);
      return;
    }

    setFindings(findingRows ?? []);

    const { data: blockedRows, error: blockedError } = await supabase
      .from("blocked_ips")
      .select("id, ip, reason, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (!blockedError) {
      setBlockedIps(blockedRows ?? []);
    }

    setLoading(false);
  }

  async function handleGenerateKey() {
    setError(null);
    setGenerating(true);
    const newKey = generateApiKey();

    const { error: insertError } = await supabase.from("api_keys").insert({
      project_id: projectId,
      key: newKey,
    });

    setGenerating(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setRevealedKey(newKey);
    await loadData();
  }

  async function handleRevokeKey(keyId: string) {
    setError(null);
    const { error: updateError } = await supabase
      .from("api_keys")
      .update({ revoked: true })
      .eq("id", keyId);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await loadData();
  }

  async function handleUpgrade() {
    setError(null);
    setUpgrading(true);

    const { error: updateError } = await supabase
      .from("projects")
      .update({ plan: "premium" })
      .eq("id", projectId);

    setUpgrading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await loadData();
  }

  if (loading) {
    return null;
  }

  if (error || !project) {
    return (
      <div className="flex-1 overflow-y-auto px-8 py-10">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-muted hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to overview
        </Link>
        <p className="mt-6 text-sm text-red-400">
          {error ?? "Something went wrong."}
        </p>
      </div>
    );
  }

  const isPremium = project.plan === "premium";

  return (
    <div className="flex-1 overflow-y-auto px-8 py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-muted hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to overview
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-medium">{project.name}</h1>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                  isPremium
                    ? "border-brand/40 text-brand"
                    : "border-line text-muted"
                }`}
              >
                {isPremium ? "Premium" : "Free"}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              Created {new Date(project.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isPremium && (
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="flex items-center gap-1.5 rounded-md border border-brand/40 px-4 py-2 text-sm text-brand hover:bg-brand/10 disabled:opacity-60"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {upgrading ? "Upgrading..." : "Upgrade to Premium"}
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

        {!isPremium && (
          <p className="mt-2 text-xs text-muted">
            This upgrade button is a live preview — payments aren&apos;t
            connected yet, but the plan change is real and unlocks Premium
            detection features immediately.
          </p>
        )}

        {revealedKey && (
          <div className="mt-6 rounded-md border border-brand/40 bg-ink px-4 py-3">
            <p className="text-xs text-brand">
              Copy this now — you won&apos;t see the full key again.
            </p>
            <p className="mt-1 select-all break-all font-mono text-sm">
              {revealedKey}
            </p>
          </div>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-line bg-panel p-6">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-muted" />
              <h2 className="font-display text-base font-medium">API keys</h2>
            </div>
            {keys.length === 0 && (
              <p className="mt-3 text-sm text-muted">
                No keys yet — generate one above to start sending events.
              </p>
            )}
            <ul className="mt-4 flex flex-col gap-3">
              {keys.map((k) => (
                <li
                  key={k.id}
                  className="flex items-center justify-between rounded-md border border-line px-4 py-3"
                >
                  <div>
                    <p className="font-mono text-sm">{maskKey(k.key)}</p>
                    <p className="mt-1 text-xs text-muted">
                      Created {new Date(k.created_at).toLocaleDateString()}
                      {k.revoked && (
                        <span className="ml-2 text-red-400">Revoked</span>
                      )}
                    </p>
                  </div>
                  {!k.revoked && (
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
          </section>

          <section className="rounded-2xl border border-line bg-panel p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ban className="h-4 w-4 text-muted" />
                <h2 className="font-display text-base font-medium">
                  Active Defense
                </h2>
              </div>
              <span className="rounded-full border border-brand/40 px-3 py-1 text-xs text-brand">
                {blockedIps.length} blocked
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              IPs automatically blocked after matching an attack pattern or
              repeated failed logins.
            </p>

            <div className="mt-4 flex items-center justify-between rounded-md border border-dashed border-line px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-muted">
                <Sparkles className="h-4 w-4" />
                Smart auto-patch suggestions
              </div>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                  isPremium
                    ? "border-brand/40 text-brand"
                    : "border-line text-muted"
                }`}
              >
                {isPremium ? "Active" : "Premium"}
              </span>
            </div>

            {blockedIps.length === 0 && (
              <p className="mt-4 text-sm text-muted">
                No blocked IPs yet — this fills in automatically as your app
                sends requests through Net Composure.
              </p>
            )}

            <ul className="mt-4 flex flex-col gap-2">
              {blockedIps.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between rounded-md border border-line px-4 py-3"
                >
                  <div>
                    <p className="font-mono text-sm">{b.ip}</p>
                    {b.reason && (
                      <p className="mt-1 text-xs text-muted">{b.reason}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted">
                    {new Date(b.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-line bg-panel p-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-muted" />
            <h2 className="font-display text-base font-medium">Findings</h2>
          </div>

          {findings.length === 0 && (
            <p className="mt-3 text-sm text-muted">
              No findings yet — this project&apos;s security scans will
              appear here once you send events using your API key.
            </p>
          )}

          <ul className="mt-4 flex flex-col gap-3">
            {findings.map((f) => (
              <li
                key={f.id}
                className={`rounded-md border px-4 py-3 ${
                  SEVERITY_COLOR[f.severity] ?? "border-line"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-text">{f.title}</p>
                  <span className="text-xs uppercase tracking-wide">
                    {f.severity}
                  </span>
                </div>
                {f.detail && (
                  <p className="mt-1 text-xs text-muted">{f.detail}</p>
                )}
                <p className="mt-2 text-xs text-muted">
                  {new Date(f.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}