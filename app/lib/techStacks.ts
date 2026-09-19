export type StackOption = {
  id: string;
  label: string;
  group: string;
};

export const TECH_STACKS: StackOption[] = [
  { id: "html-js", label: "HTML / CSS / JavaScript", group: "Frontend Web" },
  { id: "react", label: "React", group: "Frontend Web" },
  { id: "nextjs", label: "Next.js", group: "Frontend Web" },
  { id: "vue", label: "Vue.js", group: "Frontend Web" },
  { id: "nuxt", label: "Nuxt.js", group: "Frontend Web" },
  { id: "angular", label: "Angular", group: "Frontend Web" },
  { id: "svelte", label: "Svelte / SvelteKit", group: "Frontend Web" },
  { id: "remix", label: "Remix", group: "Frontend Web" },
  { id: "astro", label: "Astro", group: "Frontend Web" },
  { id: "ember", label: "Ember.js", group: "Frontend Web" },
  { id: "solid", label: "SolidJS", group: "Frontend Web" },
  { id: "gatsby", label: "Gatsby", group: "Frontend Web" },
  { id: "node-express", label: "Node.js / Express", group: "Backend" },
  { id: "nestjs", label: "NestJS", group: "Backend" },
  { id: "fastify", label: "Fastify", group: "Backend" },
  { id: "python-fastapi", label: "Python / FastAPI", group: "Backend" },
  { id: "python-django", label: "Python / Django", group: "Backend" },
  { id: "python-flask", label: "Python / Flask", group: "Backend" },
  { id: "java-spring", label: "Java / Spring Boot", group: "Backend" },
  { id: "csharp-dotnet", label: "C# / .NET", group: "Backend" },
  { id: "ruby-rails", label: "Ruby on Rails", group: "Backend" },
  { id: "php-laravel", label: "PHP / Laravel", group: "Backend" },
  { id: "php-vanilla", label: "PHP (vanilla)", group: "Backend" },
  { id: "go", label: "Go", group: "Backend" },
  { id: "rust-actix", label: "Rust / Actix", group: "Backend" },
  { id: "elixir-phoenix", label: "Elixir / Phoenix", group: "Backend" },
  { id: "kotlin-spring", label: "Kotlin / Spring", group: "Backend" },
  { id: "cpp-server", label: "C++ (server)", group: "Backend" },
  { id: "react-native", label: "React Native", group: "Mobile" },
  { id: "flutter", label: "Flutter", group: "Mobile" },
  { id: "swift-ios", label: "Swift (iOS)", group: "Mobile" },
  { id: "kotlin-android", label: "Kotlin (Android)", group: "Mobile" },
  { id: "java-android", label: "Java (Android)", group: "Mobile" },
  { id: "xamarin", label: "Xamarin / MAUI", group: "Mobile" },
  { id: "ionic", label: "Ionic", group: "Mobile" },
  { id: "electron", label: "Electron", group: "Desktop" },
  { id: "tauri", label: "Tauri", group: "Desktop" },
  { id: "csharp-wpf", label: "C# / WPF", group: "Desktop" },
  { id: "cpp-qt", label: "C++ / Qt", group: "Desktop" },
  { id: "python-desktop", label: "Python (Tkinter/PyQt)", group: "Desktop" },
  { id: "python-general", label: "Python (general script/service)", group: "Other" },
  { id: "java-general", label: "Java (general)", group: "Other" },
  { id: "csharp-general", label: "C# (general)", group: "Other" },
  { id: "cpp-general", label: "C++ (general)", group: "Other" },
  { id: "c-general", label: "C", group: "Other" },
  { id: "typescript-general", label: "TypeScript (general)", group: "Other" },
  { id: "shopify", label: "Shopify / Liquid", group: "Other" },
  { id: "wordpress", label: "WordPress / PHP", group: "Other" },
  { id: "webflow", label: "Webflow (custom code)", group: "Other" },
  { id: "unity-csharp", label: "Unity / C#", group: "Other" },
  { id: "unreal-cpp", label: "Unreal Engine / C++", group: "Other" },
  { id: "dart-server", label: "Dart (server-side)", group: "Other" },
  { id: "scala-play", label: "Scala / Play", group: "Other" },
  { id: "perl", label: "Perl", group: "Other" },
  { id: "other", label: "Other / Not listed", group: "Other" },
];

export function getSnippetForStack(stackId: string, apiKey: string): string {
  const browserBased = ["html-js", "react", "vue", "svelte", "webflow"];
  const nodeBased = [
    "nextjs",
    "nuxt",
    "remix",
    "astro",
    "gatsby",
    "node-express",
    "nestjs",
    "fastify",
    "electron",
    "tauri",
    "react-native",
    "ionic",
    "typescript-general",
  ];
  const pythonBased = [
    "python-fastapi",
    "python-django",
    "python-flask",
    "python-general",
    "python-desktop",
  ];
  const javaBased = [
    "java-spring",
    "java-android",
    "java-general",
    "kotlin-spring",
    "kotlin-android",
  ];

  if (pythonBased.includes(stackId)) {
    return `from netcomposure import NetComposure
import os

nc = NetComposure(os.environ["NET_COMPOSURE_API_KEY"])
# nc = NetComposure("${apiKey}")  # or hardcode directly for quick testing

result = await nc.check_request(request_ip, request_data)
if result["status"] == "blocked":
    raise HTTPException(status_code=403, detail="Blocked by Net Composure")`;
  }

  if (javaBased.includes(stackId)) {
    return `HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://netcomposure-engine.onrender.com/v1/check-request"))
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer ${apiKey}")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();

client.send(request, HttpResponse.BodyHandlers.ofString());`;
  }

  if (nodeBased.includes(stackId)) {
    return `const NetComposure = require("netcomposure");
const nc = new NetComposure("${apiKey}");

app.post("/login", async (req, res) => {
  const check = await nc.checkRequest(req.ip, req.body);
  if (check.status === "blocked") {
    return res.status(403).json({ error: "Blocked by Net Composure" });
  }
  // ...your normal logic
});`;
  }

  if (browserBased.includes(stackId)) {
    return `<script src="https://netcomposure.netlify.app/sdk/netcomposure.js"></script>
<script>
  const nc = new NetComposure("${apiKey}");
  // Call nc.checkRequest(...) before submitting forms or uploads
</script>`;
  }

  return `// Direct HTTP call — works from any language
POST https://netcomposure-engine.onrender.com/v1/check-request
Authorization: Bearer ${apiKey}
Content-Type: application/json

{ "ip": "<sender ip>", "data": { ... } }`;
}
