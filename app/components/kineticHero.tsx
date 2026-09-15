"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function KineticHero() {
  const wordsRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const words = wordsRef.current
      ? Array.from(wordsRef.current.querySelectorAll("span.word"))
      : [];

    const tl = gsap.timeline({ delay: 1.5 });

    tl.set(words, { yPercent: 120, rotateZ: 4, opacity: 0 })
      .set([subRef.current, ctaRef.current], { y: 16, opacity: 0 })
      .to(words, {
        yPercent: 0,
        rotateZ: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.06,
        ease: "power4.out",
      })
      .to(
        subRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .to(
        ctaRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );

    gsap.to(scanRef.current, {
      yPercent: 400,
      duration: 6,
      repeat: -1,
      ease: "sine.inOut",
      yoyo: true,
    });
  }, []);

  const headline = ["Know", "what's", "happening", "inside", "your", "app", "before", "it", "becomes", "a", "breach."];

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        ref={scanRef}
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand/10 via-brand/0 to-transparent"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 py-28 text-center md:py-40">
        <h1
          ref={wordsRef}
          className="font-display text-4xl font-medium leading-tight md:text-6xl"
        >
          {headline.map((word, i) => (
            <span key={i} className="mr-3 inline-block overflow-hidden align-top">
              <span className="word inline-block">{word}</span>
            </span>
          ))}
        </h1>
        <p
          ref={subRef}
          className="mx-auto mt-6 max-w-lg text-base text-muted"
        >
          Net Composure watches the security signals your app already
          produces and turns them into findings your team can act on —
          then takes safe, automatic action on the clear-cut ones.
        </p>
        <div ref={ctaRef} className="mt-9 flex justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-md bg-brand px-6 py-3 text-sm font-medium text-ink hover:bg-brand-dim"
          >
            Get started
          </Link>
          <Link
            href="/docs"
            className="rounded-md border border-line px-6 py-3 text-sm font-medium text-text hover:border-white/20"
          >
            View the API
          </Link>
        </div>
      </div>
    </section>
  );
}