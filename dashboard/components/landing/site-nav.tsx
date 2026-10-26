"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Menu, UserRound, X } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "./buttons";
import { inviteUrl, loginUrl } from "@/lib/api";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Dashboard", href: "#dashboard" },
];

const TEXT_LINK =
  "rds-nav-link whitespace-nowrap font-rds-sans font-medium text-rds-fg-body transition-colors duration-rds-fast ease-rds-default hover:text-rds-fg hover:no-underline";

const ROW =
  "block w-full border-b border-white/30 py-rds-3 text-left font-rds-sans text-rds-body-lg font-medium text-rds-fg";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuTop, setMenuTop] = useState<number | undefined>(undefined);
  const headerRef = useRef<HTMLElement>(null);

  // The bar turns to glass as soon as the page moves under it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggleMenu = () => {
    // The panel hangs from the bar.
    if (!open) setMenuTop(headerRef.current?.getBoundingClientRect().bottom);
    setOpen((v) => !v);
  };

  return (
    <>
      <header
        ref={headerRef}
        className="rds-nav"
        data-scrolled={scrolled || undefined}
        data-open={open || undefined}
      >
        <div className="rds-nav-inner">
          <a href="#top" aria-label="Plummet home" className="rds-nav-logo shrink-0 justify-self-start hover:no-underline">
            <Logo />
          </a>

          <nav aria-label="Primary" className="rds-nav-links hidden items-center xl:flex">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className={TEXT_LINK}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="rds-nav-right flex shrink-0 items-center justify-self-end">
            <a href={loginUrl} aria-label="Sign in" className="rds-nav-icon hidden xl:flex">
              <UserRound strokeWidth={1.5} />
            </a>
            <a
              href={loginUrl}
              className="rds-nav-link hidden whitespace-nowrap font-rds-sans font-medium text-rds-fg transition-colors duration-rds-fast ease-rds-default hover:text-rds-fg-body hover:no-underline xl:inline-flex"
            >
              Sign in
            </a>
            <Button href={inviteUrl} theme="primary" size="sm" className="rds-nav-cta">
              Add to Discord
            </Button>

            <button
              type="button"
              onClick={toggleMenu}
              aria-expanded={open}
              aria-controls="rds-mobile-panel"
              aria-label={open ? "Close menu" : "Open menu"}
              className="rds-nav-menu -mr-rds-1 flex shrink-0 items-center justify-center rounded-rds-sm text-rds-fg-body transition-colors duration-rds-fast ease-rds-default hover:text-rds-fg xl:hidden"
            >
              {open ? <X strokeWidth={1.5} /> : <Menu strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        <div
          id="rds-mobile-panel"
          hidden={!open}
          className="fixed inset-x-0 top-rds-header h-[calc(100dvh-var(--rds-menu-top,var(--rds-header-h)))] overflow-y-auto bg-rds-midnight px-rds-container-pad py-rds-4 xl:hidden"
          style={menuTop === undefined ? undefined : ({ top: menuTop, "--rds-menu-top": `${menuTop}px` } as CSSProperties)}
        >
          <ul>
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)} className={ROW}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-rds-6 flex flex-col gap-rds-3">
            <Button href={inviteUrl} theme="primary" size="lg" fullWidth>
              Add to Discord
            </Button>
            <Button href={loginUrl} theme="secondary" size="lg" fullWidth>
              Sign in
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
