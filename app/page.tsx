"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const EVENT_POOL = [
  { level: "INFO", text: "auth.session.created  user=8f2e...c1" },
  { level: "INFO", text: "dependency.scan       lodash@4.17.11" },
  { level: "WARN", text: "config.exposed        DEBUG=true in prod" },
  { level: "HIGH", text: "cve.match             CVE-2023-26136" },
  { level: "INFO", text: "request.rate          212 req/min" },
  { level: "WARN", text: "cors.wildcard         Access-Control-Allow-Origin: *" },
  { level: "INFO", text: "dependency.scan       express@4.18.2" },
  { level: "HIGH", text: "secret.detected       key committed to /config" },
];

const LEVEL_COLOR: Record<string, string> = {
  INFO: "text-muted",
  WARN: "text-yellow-400/80",
  HIGH: "text-brand",
};

function LiveTerminal() {
  const [lines, setLines] = useState(EVENT_POOL.slice(0, 4));

  useEffect(() => {
    let i = 4;
    const id = setInterval(() => {
      setLines((prev) => {
        const next = EVENT_POOL[i % EVENT_POOL.length];
        i += 1;
        return [...prev.slice(1), next];
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-lg border border-line bg-panel shadow-2xl shadow-black/40">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-3 text-xs text-muted">events.stream</span>
      </div>
      <div className="h-64 overflow-hidden px-4 py-4 font-mono text-[13px] leading-6">
        {lines.map((line, idx) => (
          <div key={`${line.text}-${idx}`} className="log-line flex gap-3">
            <span className={`w-10 shrink-0 ${LEVEL_COLOR[line.level]}`}>
              {line.level}
            </span>
            <span className="text-text/80">{line.text}</span>
          </div>
        ))}
        <span className="cursor-blink text-brand">▍</span>
      </div>
    </div>
  );
}

function NavBar() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-brand" />
          <span className="font-display text-lg font-medium">Net Composure</span>
        </div>
        <nav className="hidden gap-8 text-sm text-muted md:flex">
          <Link href="/product" className="hover:text-text">Product</Link>
          <Link href="/#how-it-works" className="hover:text-text">How it works</Link>
          <Link href="/pricing" className="hover:text-text">Pricing</Link>
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/login" className="text-muted hover:text-text">Log in</Link>
          <Link
            href="/signup"
            className="rounded-md bg-brand px-4 py-2 font-medium text-ink hover:bg-brand-dim"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
      <div>
        <h1 className="font-display text-4xl font-medium leading-tight md:text-5xl">
          Know what&apos;s happening inside your app before it becomes a breach.
        </h1>
        <p className="mt-5 max-w-md text-base text-muted">
          Net Composure watches the security signals your app already
          produces and turns them into findings your team can actually act
          on — ranked by severity, with a fix attached.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/signup"
            className="rounded-md bg-brand px-5 py-3 text-sm font-medium text-ink hover:bg-brand-dim"
          >
            Get started
          </Link>
          <Link
            href="/docs"
            className="rounded-md border border-line px-5 py-3 text-sm font-medium text-text hover:border-white/20"
          >
            View the API
          </Link>
        </div>
      </div>
      <LiveTerminal />
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Send events",
      body: "Your app reports security-relevant activity to Net Composure through a small SDK call or a direct API request.",
    },
    {
      n: "2",
      title: "We analyze",
      body: "Net Composure checks it against known vulnerabilities, misconfigurations, and suspicious behavior patterns.",
    },
    {
      n: "3",
      title: "Findings appear",
      body: "Results land in your dashboard with severity, context, and a clear remediation step.",
    },
  ];
  return (
    <section id="how-it-works" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl font-medium">How it works</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n}>
              <span className="font-display text-sm text-brand">{s.n}</span>
              <h3 className="mt-3 font-display text-lg font-medium">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      title: "Dependency scanning",
      body: "Flags known-vulnerable packages in your project before they ship.",
    },
    {
      title: "Misconfiguration checks",
      body: "Catches exposed debug modes, open CORS policies, and weak defaults.",
    },
    {
      title: "Malware analysis",
      body: "Runs suspicious files in an isolated environment and reports what they do.",
    },
    {
      title: "Real-time alerts",
      body: "Sends a notification the moment a high-severity finding is created.",
    },
  ];
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className="border-l border-line pl-5">
              <h3 className="font-display text-base font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center">
        <h2 className="font-display text-2xl font-medium">
          Start securing your app in minutes.
        </h2>
        <Link
          href="/signup"
          className="rounded-md bg-brand px-5 py-3 text-sm font-medium text-ink hover:bg-brand-dim"
        >
          Get started
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 text-sm sm:grid-cols-3">
        <div>
          <p className="font-display text-text">Product</p>
          <ul className="mt-3 space-y-2 text-muted">
            <li><Link href="/product" className="hover:text-text">Overview</Link></li>
            <li><Link href="/pricing" className="hover:text-text">Pricing</Link></li>
            <li><Link href="/docs" className="hover:text-text">Docs</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-display text-text">Developers</p>
          <ul className="mt-3 space-y-2 text-muted">
            <li><Link href="/docs" className="hover:text-text">API reference</Link></li>
            <li><Link href="/sdks" className="hover:text-text">SDKs</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-display text-text">Company</p>
          <ul className="mt-3 space-y-2 text-muted">
            <li><Link href="/about" className="hover:text-text">About</Link></li>
            <li><Link href="/contact" className="hover:text-text">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line px-6 py-6 text-center text-xs text-muted">
        © 2026 Net Composure.
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <NavBar />
      <Hero />
      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}