"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CircleAlert, X } from "lucide-react";

const MESSAGES: Record<string, string> = {
  "auth:cancelled": "Sign-in was cancelled.",
  "auth:error": "Sign-in failed. Please try again.",
  "bot:cancelled": "Bot authorization was cancelled.",
  "bot:error": "Couldn't add the bot. Please try again.",
};

function NoticeInner() {
  const params = useSearchParams();
  const key = params.get("auth")
    ? `auth:${params.get("auth")}`
    : params.get("bot")
      ? `bot:${params.get("bot")}`
      : null;
  const [open, setOpen] = useState(true);

  const message = key ? MESSAGES[key] : undefined;
  if (!message || !open) return null;

  const failed = key?.endsWith(":error");

  return (
    <div className="fixed inset-x-0 top-[calc(var(--rds-header-h)+8px)] z-90 flex justify-center px-rds-container-pad">
      <div
        role={failed ? "alert" : "status"}
        data-tone={failed ? "error" : undefined}
        className="rds-message w-full max-w-[480px] shadow-rds-lg"
      >
        <CircleAlert strokeWidth={1.5} aria-hidden />
        <p className="text-rds-fg">{message}</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Dismiss"
          className="-my-1 -mr-1 grid size-7 place-items-center rounded-rds-xs text-rds-dusk-30 transition-colors duration-rds-fast hover:bg-white/6 hover:text-rds-fg"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

export function AuthNotice() {
  return (
    <Suspense fallback={null}>
      <NoticeInner />
    </Suspense>
  );
}
