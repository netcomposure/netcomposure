"use client";

import { useState } from "react";
import Link from "next/link";

const LANGUAGES = [
  {
    id: "html",
    label: "HTML / JS",
    snippet: `<script>
async function checkRequest(ip, data) {
  const res = await fetch("https://engine.netcomposure.dev/v1/check-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_API_KEY"
    },
    body: JSON.stringify({ ip, data })
  });
  return res.json();
}
</script>`,
  },
  {
    id: "node",
    label: "Node / React / Next.js",
    snippet: `const axios = require("axios");

async function checkRequest(ip, data) {
  const res = await axios.post(
    "https://engine.netcomposure.dev/v1/check-request",
    { ip, data },
    { headers: { Authorization: \`Bearer \${process.env.NET_COMPOSURE_API_KEY}\` } }
  );
  return res.data;
}`,
  },
  {
    id: "python",
    label: "Python",
    snippet: `import httpx, os

async def check_request(ip: str, data: dict) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://engine.netcomposure.dev/v1/check-request",
            json={"ip": ip, "data": data},
            headers={"Authorization": f"Bearer {os.environ['NET_COMPOSURE_API_KEY']}"},
        )
    return response.json()`,
  },
  {
    id: "java",
    label: "Java",
    snippet: `HttpClient client = HttpClient.newHttpClient();
String body = "{\\"ip\\":\\"" + ip + "\\",\\"data\\":" + data + "}";

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://engine.netcomposure.dev/v1/check-request"))
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer " + System.getenv("NET_COMPOSURE_API_KEY"))
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();

HttpResponse<String> response =
    client.send(request, HttpResponse.BodyHandlers.ofString());`,
  },
  {
    id: "cpp",
    label: "C++",
    snippet: `#include <curl/curl.h>

CURL* curl = curl_easy_init();
std::string url = "https://engine.netcomposure.dev/v1/check-request";
std::string body = "{\\"ip\\":\\"" + ip + "\\",\\"data\\":" + data + "}";

struct curl_slist* headers = NULL;
headers = curl_slist_append(headers, "Content-Type: application/json");
headers = curl_slist_append(headers, ("Authorization: Bearer " + apiKey).c_str());

curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body.c_str());
curl_easy_perform(curl);`,
  },
  {
    id: "csharp",
    label: "C#",
    snippet: `using var client = new HttpClient();
client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

var payload = new { ip, data };
var content = new StringContent(
    JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

var response = await client.PostAsync(
    "https://engine.netcomposure.dev/v1/check-request", content);
var result = await response.Content.ReadAsStringAsync();`,
  },
];

export default function SdksPage() {
  const [active, setActive] = useState(LANGUAGES[0].id);
  const current = LANGUAGES.find((l) => l.id === active)!;

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/" className="text-sm text-muted hover:text-text">
        ← Back to home
      </Link>

      <h1 className="mt-4 font-display text-3xl font-medium">SDKs &amp; Integrations</h1>
      <p className="mt-3 text-muted">
        Net Composure is a plain HTTP API — connect it from any language or
        platform that can send a web request. Pick yours below.
      </p>

      <div className="mt-8 rounded-lg border border-line bg-panel p-5">
        <p className="text-sm">Install via terminal</p>
        <pre className="mt-2 overflow-x-auto rounded-md bg-ink p-3 text-xs">
{`# Node.js
npm install netcomposure

# Python
pip install netcomposure`}
        </pre>
        <p className="mt-2 text-xs text-muted">
          Published packages are on the way — in the meantime, every snippet
          below works today with no install at all.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setActive(lang.id)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              active === lang.id
                ? "border-brand bg-brand text-ink"
                : "border-line text-muted hover:text-text"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      <pre className="mt-6 overflow-x-auto rounded-lg border border-line bg-panel p-5 text-xs">
        <code>{current.snippet}</code>
      </pre>

      <p className="mt-6 text-sm text-muted">
        Every language above hits the same real endpoints — see the full{" "}
        <Link href="/docs" className="text-brand hover:underline">
          integration guide
        </Link>{" "}
        for all available calls (malware scanning, dependency checks, the
        firewall, and more).
      </p>
    </main>
  );
}