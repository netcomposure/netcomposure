"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollFX() {
  useEffect(() => {
    const glow = document.querySelector<HTMLDivElement>("[data-scroll-glow]");
    if (glow) {
      gsap.to(glow, {
        backgroundColor: "rgba(62, 207, 142, 0.12)",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    }

    const spinEls = document.querySelectorAll<HTMLElement>("[data-scroll-spin]");
    spinEls.forEach((el) => {
      gsap.to(el, {
        rotate: 360,
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      data-scroll-glow
      className="pointer-events-none fixed inset-0 -z-10 transition-colors"
      style={{ backgroundColor: "rgba(62, 207, 142, 0)" }}
    />
  );
}