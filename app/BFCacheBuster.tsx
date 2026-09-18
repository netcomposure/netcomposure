"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function BFCacheBuster() {
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => {};
    window.addEventListener("unload", handler);
    return () => window.removeEventListener("unload", handler);
  }, [pathname]);

  return null;
}