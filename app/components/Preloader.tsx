"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CODE_SNIPPETS = [
  "0x8F2E", "SELECT *", "auth.verify()", "SHA256", "GET /v1/scan",
  "0xA91C", "if (threat)", "nc_live_", "block(ip)", "0x3D7B",
  "return finding", "CVE-2024", "revoke()", "0xE420", "firewall.check",
];

function CodeColumn({ delay }: { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { y: "-100%" },
      { y: "100vh", duration: 1.6, delay, ease: "power1.in" }
    );
  }, [delay]);

  const lines = Array.from({ length: 14 }, () => {
    const idx = Math.floor(Math.random() * CODE_SNIPPETS.length);
    return CODE_SNIPPETS[idx];
  });

  return (
    <div
      ref={ref}
      className="flex flex-col gap-2 font-mono text-[11px] text-brand/70"
    >
      {lines.map((line, i) => (
        <span key={i}>{line}</span>
      ))}
    </div>
  );
}

export default function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [showRain, setShowRain] = useState(false);
  const [percent, setPercent] = useState(0);
  const percentRef = useRef(0);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("nc_intro_seen");
    if (alreadySeen) {
      setHidden(true);
      return;
    }

    document.body.style.overflow = "hidden";

    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        sessionStorage.setItem("nc_intro_seen", "true");
        setHidden(true);
      },
    });

    tl.to(counter, {
      value: 100,
      duration: 1.3,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(counter.value);
        percentRef.current = v;
        setPercent(v);
      },
    })
      .call(() => setShowRain(true))
      .to({}, { duration: 1.6 })
      .to(overlayRef.current, {
        yPercent: -100,
        duration: 0.7,
        ease: "power4.inOut",
      });
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 overflow-hidden bg-ink"
    >
      {showRain && (
        <div className="pointer-events-none absolute inset-0 grid grid-cols-6 gap-4 px-6 opacity-40 sm:grid-cols-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <CodeColumn key={i} delay={i * 0.05} />
          ))}
        </div>
      )}

      <div className="relative flex flex-col items-center gap-3">
        <span className="font-display text-sm tracking-wide text-muted">
          NET COMPOSURE
        </span>
        <span className="font-display text-6xl font-medium tabular-nums md:text-7xl">
          {percent}
          <span className="text-brand">%</span>
        </span>
        <div className="h-px w-48 overflow-hidden bg-line">
          <div
            className="h-full bg-brand transition-[width] duration-150 ease-linear"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}