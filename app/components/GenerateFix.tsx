"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

function parseFixCommand(detail: string): { command: string } | null {
  const match = detail.match(/Upgrade (\S+) from (\S+) to (\S+)/);
  if (!match) return null;

  const [, packageName, , fixedVersion] = match;

  const isPython = packageName.includes("_") || !packageName.includes("-");
  const npmCommand = `npm install ${packageName}@${fixedVersion}`;

  return { command: npmCommand };
}

export default function GenerateFix({ detail }: { detail: string }) {
  const [copied, setCopied] = useState(false);
  const parsed = parseFixCommand(detail);

  if (!parsed) return null;

  async function handleCopy() {
    await navigator.clipboard.writeText(parsed!.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-3 flex items-center justify-between gap-3 rounded-md border border-line bg-ink px-3 py-2.5">
      <code className="overflow-x-auto whitespace-nowrap font-mono text-xs text-brand">
        {parsed.command}
      </code>
      <button
        onClick={handleCopy}
        className="flex shrink-0 items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs text-text hover:border-brand/40 hover:text-brand"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            Copy
          </>
        )}
      </button>
    </div>
  );
}