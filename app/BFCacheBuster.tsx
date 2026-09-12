"use client";

import { useEffect } from "react";

export default function BFCacheBuster() {
  useEffect(() => {
    const handler = () => {};
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    });
    window.addEventListener("unload", handler);
    return () => window.removeEventListener("unload", handler);
  }, []);

  return null;
}