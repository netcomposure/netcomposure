"use client";

import { useState } from "react";
import { Zap, X } from "lucide-react";

export default function ConnectPanel({
  hasKey,
}: {
  hasKey: boolean;
}) {
  const [open, setOpen] = useState(false);

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

            {!hasKey ? (
              <p className="mt-4 text-sm text-muted">
                Generate an API key first, then download your SDK.
              </p>
            ) : (
              <ol className="mt-4 flex flex-col gap-3 text-sm text-muted">
                <li>
                  <span className="text-text">1.</span> Click <span className="text-brand">Download SDK</span> above. It comes with your key already inside.
                </li>
                <li>
                  <span className="text-text">2.</span> Move <code className="rounded bg-ink px-1">netcomposure.js</code> into your project&apos;s root folder.
                </li>
                <li>
                  <span className="text-text">3.</span> Add <code className="rounded bg-ink px-1">netcomposure.js</code> to your <code className="rounded bg-ink px-1">.gitignore</code> because it contains your real key.
                </li>
                <li>
                  <span className="text-text">4.</span> Import it wherever you handle logins, uploads, or requests you want protected.
                </li>
              </ol>
            )}
          </div>
        </div>
      )}
    </>
  );
}
