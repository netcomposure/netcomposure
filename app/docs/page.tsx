import Link from "next/link";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";

export default function DocsPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm text-muted hover:text-text">
          ← Back to home
        </Link>

        <h1 className="mt-4 font-display text-3xl font-medium">
          Connecting Net Composure to your app
        </h1>
        <p className="mt-3 text-muted">
          Net Composure works the same way as any API-based service you&apos;ve
          used before — get a key, store it as an environment variable, call
          the API from your code.
        </p>

        <section className="mt-10">
          <h2 className="font-display text-xl font-medium">1. Get your API key</h2>
          <p className="mt-2 text-sm text-muted">
            In your Net Composure dashboard, open a project (or create one)
            and click Generate API key. Copy the full key immediately — it&apos;s
            shown only once.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-medium">
            2. Store it as an environment variable
          </h2>
          <p className="mt-2 text-sm text-muted">
            In your own app&apos;s project, add it to your .env file:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-panel p-4 text-xs">
{`NET_COMPOSURE_API_KEY=nc_live_your_real_key_here`}
          </pre>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-medium">
            3. Check requests before you process them
          </h2>
          <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-panel p-4 text-xs">
{`const axios = require("axios");

app.post("/login", async (req, res) => {
  const check = await axios.post(
    "https://netcomposure-engine.onrender.com/v1/check-request",
    { ip: req.ip, data: req.body },
    { headers: { Authorization: \`Bearer \${process.env.NET_COMPOSURE_API_KEY}\` } }
  );

  if (check.data.status === "blocked") {
    return res.status(403).json({ error: "Request blocked by Net Composure" });
  }
});`}
          </pre>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-medium">
            4. Report failed logins
          </h2>
          <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-panel p-4 text-xs">
{`await axios.post(
  "https://netcomposure-engine.onrender.com/v1/report-event",
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
  "https://netcomposure-engine.onrender.com/v1/scan-file",
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
          <pre className="mt-2 overflow-x-auto rounded-lg border border-line bg-panel p-4 text-xs">
{`await axios.post(
  "https://netcomposure-engine.onrender.com/v1/scan-dependencies",
  { ecosystem: "npm", dependencies: [{ name: "lodash", version: "4.17.11" }] },
  { headers: { Authorization: \`Bearer \${process.env.NET_COMPOSURE_API_KEY}\` } }
);`}
          </pre>
        </section>

        <div className="mt-12 rounded-lg border border-brand/30 bg-brand/5 p-5 text-sm">
          Every check above also writes a real finding to your Net Composure
          dashboard — so you get an instant programmatic answer in your
          code, and a permanent, reviewable record in your account.
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
