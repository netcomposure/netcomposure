"use client";

import { useState } from "react";
import { Copy, Check, Zap, X } from "lucide-react";
import { getSnippetForStack, TECH_STACKS } from "../lib/techStacks";

export default function ConnectPanel({
  apiKey,
  stack,
  onStackChange,
}: {
  apiKey: string | null;
  stack: string | null;
  onStackChange: (newStack: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const snippet = apiKey ? getSnippetForStack(stack ?? "other", apiKey) : "";
  const stackLabel = TECH_STACKS.find((option) => option.id === stack)?.label ?? "Not set";

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-xs text-muted hover:border-brand/40 hover:text-brand"
      >
        <Zap className="h-3.5 w-3.5" />
        Connect
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-panel p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-brand" />
                <h3 className="font-display text-lg font-medium">Connect this project</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close connect dialog"
                className="text-muted hover:text-text"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!apiKey ? (
              <p className="mt-4 text-sm text-muted">
                Generate an API key first to get your connection snippet.
              </p>
            ) : (
              <>
                <label className="mt-4 block text-xs text-muted">
                  Language / framework
                </label>
                <select
                  value={stack ?? ""}
                  onChange={(e) => onStackChange(e.target.value)}
                  className="mt-1 w-full rounded-md border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-brand"
                >
                  <option value="">Select your language / framework</option>
                  {Array.from(new Set(TECH_STACKS.map((option) => option.group))).map(
                    (group) => (
                      <optgroup key={group} label={group}>
                        {TECH_STACKS.filter((option) => option.group === group).map(
                          (option) => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          )
                        )}
                      </optgroup>
                    )
                  )}
                </select>

                <p className="mt-4 text-sm text-muted">
                  Paste this once into your {stackLabel !== "Not set" ? stackLabel : "app's"}{" "}
                  code, wherever it handles logins, uploads, or requests you want protected.
                </p>

                <div className="relative mt-3">
                  <pre className="max-h-64 overflow-auto rounded-lg border border-line bg-ink p-4 text-xs leading-relaxed text-brand">
                    <code>{snippet}</code>
                  </pre>
                  <button
                    onClick={handleCopy}
                    className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md border border-line bg-panel px-2.5 py-1.5 text-xs hover:border-brand/40"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
