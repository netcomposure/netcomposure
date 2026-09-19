"use client";

import { useState } from "react";
import { Copy, Check, Zap } from "lucide-react";

export default function ConnectPanel({ apiKey }: { apiKey: string | null }) {
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

  const snippet = `<script src="https://netcomposure.netlify.app/sdk/netcomposure.js"></script>
<script>
  const nc = new NetComposure("${apiKey}");
  // Checks every request automatically once wired into your login/upload handlers
</script>`;

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
      </div>
      <p className="mt-1 text-sm text-muted">
        Paste this once into your website or app&apos;s code. From then on, it
        protects automatically — no further setup, ever.
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
