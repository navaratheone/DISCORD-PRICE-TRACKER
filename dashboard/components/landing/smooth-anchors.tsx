"use client";

import { useEffect } from "react";
import { goToHash } from "./anchors";

/** Every in-page link glides instead of jumping. */
export function SmoothAnchors() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      if (goToHash(link.getAttribute("href") ?? "")) event.preventDefault();
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
