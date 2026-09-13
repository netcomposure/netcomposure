import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-muted hover:text-text">
        ← Back to home
      </Link>

      <h1 className="mt-4 font-display text-3xl font-medium">
        Connecting Net Composure to your app
      </h1>
      <p className="mt-3 text-muted">
        Net Composure works the same way as any API-based service you&apos;ve
        used before (Stripe, Supabase, etc.) — get a key, store it as an
        environment variable, call the API from your code.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-xl font-medium">1. Get your API key</h2>
        <p className="mt-2 text-sm text-muted">
          In your Net Composure dashboard, open a project (or create one) and
          click <span className="text-text">Generate API key</span>. Copy the
          full key immediately — it&apos;s shown only once.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-medium">
          2. Store it as an environment variable
        </h2>
        <p className="mt-2 text-sm text-muted">
          In your own app&apos;s project (not Net Composure&apos;s), add it to
          your <code className="rounded bg-panel px-1.5 py-0.5 text-xs">.env</code> file:
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-panel p-4 text-xs">
{`NET_COMPOSURE_API_KEY=nc_live_your_real_key_here`}
        </pre>
        <p className="mt-2 text-xs text-muted">
          Never commit this file to Git — add <code className="rounded bg-panel px-1 py-0.5">.env</code> to your{" "}
          <code className="rounded bg-panel px-1 py-0.5">.gitignore</code>.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-medium">
          3. Check requests before you process them
        </h2>
        <p className="mt-2 text-sm text-muted">
          Call this near the top of your request handler — before touching
          your database or business logic — so Net Composure can block bad
          requests before they do any harm.
        </p>

        <p className="mt-4 text-xs uppercase tracking-wide text-muted">
          Node.js / Express
        </p>
        <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-panel p-4 text-xs">
{`const axios = require("axios");

app.post("/login", async (req, res) => {
  const check = await axios.post(
    "https://engine.netcomposure.dev/v1/check-request",
    {
      ip: req.ip,
      data: req.body,
    },
    {
      headers: {
        Authorization: \`Bearer \${process.env.NET_COMPOSURE_API_KEY}\`,
      },
    }
  );

  if (check.data.status === "blocked") {
    return res.status(403).json({ error: "Request blocked by Net Composure" });
  }

  // ...your normal login logic continues here
});`}
        </pre>

        <p className="mt-4 text-xs uppercase tracking-wide text-muted">
          Python / FastAPI
        </p>
        <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-panel p-4 text-xs">
{`import httpx, os

async def check_request(ip: str, data: dict) -> bool:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://engine.netcomposure.dev/v1/check-request",
            json={"ip": ip, "data": data},
            headers={"Authorization": f"Bearer {os.environ['NET_COMPOSURE_API_KEY']}"},
        )
    return response.json()["status"] == "blocked"`}
        </pre>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-medium">
          4. Report failed logins (enables brute-force protection)
        </h2>
        <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-panel p-4 text-xs">
{`await axios.post(
  "https://engine.netcomposure.dev/v1/report-event",
  { event_type: "failed_login", ip: req.ip },
  { headers: { Authorization: \`Bearer \${process.env.NET_COMPOSURE_API_KEY}\` } }
);`}
        </pre>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-medium">
          5. Scan a file for malware
        </h2>
        <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-panel p-4 text-xs">
{`const formData = new FormData();
formData.append("file", uploadedFile);

const scan = await axios.post(
  "https://engine.netcomposure.dev/v1/scan-file",
  formData,
  { headers: { Authorization: \`Bearer \${process.env.NET_COMPOSURE_API_KEY}\` } }
);

if (scan.data.status === "malicious") {
  // reject the upload
}`}
        </pre>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-medium">
          6. Scan your dependencies
        </h2>
        <p className="mt-2 text-sm text-muted">
          Run this whenever you deploy, or on a schedule — send your
          package list, get back real, current vulnerability data.
        </p>
        <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-panel p-4 text-xs">
{`await axios.post(
  "https://engine.netcomposure.dev/v1/scan-dependencies",
  {
    ecosystem: "npm",
    dependencies: [{ name: "lodash", version: "4.17.11" }],
  },
  { headers: { Authorization: \`Bearer \${process.env.NET_COMPOSURE_API_KEY}\` } }
);`}
        </pre>
      </section>

      <div className="mt-12 rounded-lg border border-brand/30 bg-brand/5 p-5 text-sm">
        Every check above also writes a real finding to your Net Composure
        dashboard — so you get an instant programmatic answer in your code,
        and a permanent, reviewable record in your account.
      </div>
    </main>
  );
}