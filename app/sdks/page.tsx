"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Terminal, FileCode2 } from "lucide-react";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";

const LANGUAGES = [
  {
    id: "js",
    label: "JavaScript / Node",
    download: "/sdk/netcomposure.js",
    install: "Download netcomposure.js, or: npm install netcomposure (coming soon)",
    snippet: `const NetComposure = require("./netcomposure.js");
const nc = new NetComposure(process.env.NET_COMPOSURE_API_KEY);

const result = await nc.checkRequest(req.ip, req.body);
if (result.status === "blocked") {
  return res.status(403).json({ error: "Blocked by Net Composure" });
}`,
  },
  {
    id: "python",
    label: "Python",
    download: "/sdk/netcomposure.py",
    install: "Download netcomposure.py, or: pip install netcomposure (coming soon)",
    snippet: `from netcomposure import NetComposure
import os

nc = NetComposure(os.environ["NET_COMPOSURE_API_KEY"])

result = await nc.check_request(request.client.host, body)
if result["status"] == "blocked":
    raise HTTPException(status_code=403, detail="Blocked by Net Composure")`,
  },
  {
    id: "html",
    label: "HTML / Plain JS",
    download: "/sdk/netcomposure.js",
    install: "Download netcomposure.js and add it with a script tag",
    snippet: `<script src="netcomposure.js"></script>
<script>
  const nc = new NetComposure("YOUR_API_KEY");
  nc.checkRequest(userIp, formData).then(console.log);
</script>`,
  },
  {
    id: "java",
    label: "Java",
    download: null,
    install: "Direct HTTP call, no SDK file needed",
    snippet: `HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://engine.netcomposure.dev/v1/check-request"))
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer " + apiKey)
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();

client.send(request, HttpResponse.BodyHandlers.ofString());`,
  },
  {
    id: "cpp",
    label: "C++",
    download: null,
    install: "Direct HTTP call via libcurl",
    snippet: `CURL* curl = curl_easy_init();
curl_easy_setopt(curl, CURLOPT_URL,
  "https://engine.netcomposure.dev/v1/check-request");
curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body.c_str());
curl_easy_perform(curl);`,
  },
  {
    id: "csharp",
    label: "C#",
    download: null,
    install: "Direct HTTP call via HttpClient",
    snippet: `using var client = new HttpClient();
client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
var content = new StringContent(json, Encoding.UTF8, "application/json");
var response = await client.PostAsync(
  "https://engine.netcomposure.dev/v1/check-request", content);`,
  },
];

export default function SdksPage() {
  const [active, setActive] = useState(LANGUAGES[0].id);
  const current = LANGUAGES.find((l) => l.id === active)!;

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <Link href="/" className="text-sm text-muted hover:text-text">
          ← Back to home
        </Link>

        <div className="mt-4 flex items-center gap-3">
          <FileCode2 className="h-7 w-7 text-brand" />
          <h1 className="font-display text-3xl font-medium">SDKs &amp; Integrations</h1>
        </div>
        <p className="mt-3 max-w-2xl text-muted">
          Net Composure runs on plain HTTP — connect it from any language or
          platform that can send a web request. Download a ready-made SDK
          file below, or call the API directly.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-[220px_1fr]">
          <nav className="flex flex-row gap-2 overflow-x-auto md:flex-col md:overflow-visible">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setActive(lang.id)}
                className={`whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  active === lang.id
                    ? "bg-panel text-brand"
                    : "text-muted hover:bg-panel hover:text-text"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </nav>

          <div>
            <div className="rounded-2xl border border-line bg-panel p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Terminal className="h-4 w-4" />
                  {current.install}
                </div>
                {current.download ? (
                  <a
                    href={current.download}
                    download
                    className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-medium text-ink hover:bg-brand-dim"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download SDK
                  </a>
                ) : null}
              </div>

              <pre className="mt-5 overflow-x-auto rounded-lg border border-line bg-ink p-5 text-xs leading-relaxed">
                <code>{current.snippet}</code>
              </pre>
            </div>

            <p className="mt-6 text-sm text-muted">
              See the full{" "}
              <Link href="/docs" className="text-brand hover:underline">
                integration guide
              </Link>{" "}
              for every available endpoint.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}