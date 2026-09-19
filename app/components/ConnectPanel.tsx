"use client";

import { useState } from "react";
import { Copy, Check, Zap } from "lucide-react";
import { getSnippetForStack, TECH_STACKS } from "../lib/techStacks";

export default function ConnectPanel({
  apiKey,
  stack,
}: {
  apiKey: string | null;
  stack: string | null;
}) {
  const [copied, setCopied] = useState(false);

  if (!apiKey) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-panel p-6 text-center">
        <p className="text-sm text-muted">
          Generate an API key above to get your connection snippet.
        </p>
      </div>
    );
  }

  const snippet = getSnippetForStack(stack ?? "other", apiKey);
  const stackLabel = TECH_STACKS.find((option) => option.id === stack)?.label ?? "Any language";

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-brand/30 bg-panel p-6">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-brand" />
        <h2 className="font-display text-base font-medium">Connect this project</h2>
        <span className="rounded-full border border-line px-2 py-0.5 text-[10px] text-muted">
          {stackLabel}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">
        Paste this once into your app&apos;s code. From then on, it protects
        automatically — no further setup, ever.
      </p>
      <div className="relative mt-4">
        <pre className="overflow-x-auto rounded-lg border border-line bg-ink p-4 text-xs leading-relaxed text-brand">
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
    </div>
  );
}
