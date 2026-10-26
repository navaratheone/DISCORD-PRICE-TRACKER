"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Plus } from "lucide-react";
import { Logo } from "@/components/landing/logo";
import { Container } from "@/components/landing/section";
import { useMe } from "./me-context";
import { avatarUrl, inviteUrl, logout } from "@/lib/api";

export function AppBar() {
  const me = useMe();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function onLogout() {
    try {
      await logout();
    } finally {
      router.replace("/");
    }
  }

  return (
    <header className="rds-app-bar">
      <Container className="flex h-full items-center justify-between gap-rds-6">
        <Link
          href="/dashboard"
          className="flex shrink-0 rounded-rds-sm text-[16px] hover:no-underline xs:text-[17px]"
          aria-label="Plummet dashboard"
        >
          <Logo />
        </Link>

        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rds-avatar-btn"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label="Account menu"
          >
            <span className="rds-avatar">
              <Image
                src={avatarUrl(me)}
                alt=""
                width={34}
                height={34}
                className="select-none"
                unoptimized
              />
            </span>
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          </button>

          {open && (
            <div role="menu" className="rds-menu">
              <div className="border-b border-rds-border px-rds-2 pt-rds-1 pb-rds-3">
                <p className="font-rds-sans text-rds-body-xs text-rds-fg-muted">Signed in</p>
                <p className="mt-[2px] truncate font-rds-sans text-rds-body-sm font-medium text-rds-fg">
                  {me.username ?? "Discord user"}
                </p>
                {me.email && (
                  <p className="truncate font-rds-mono text-rds-body-xs text-rds-dusk-30">
                    {me.email}
                  </p>
                )}
              </div>
              <div className="mt-rds-2 flex flex-col">
                <a href={inviteUrl} role="menuitem" className="rds-menu-item">
                  <Plus strokeWidth={1.5} aria-hidden />
                  Add to a server
                </a>
                <button type="button" role="menuitem" onClick={onLogout} className="rds-menu-item">
                  <LogOut strokeWidth={1.5} aria-hidden />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
