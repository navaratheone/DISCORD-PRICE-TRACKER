import { cn } from "@/lib/utils";

export function PlummetMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      focusable="false"
      className={cn("block h-[1.5em] w-[1.5em] flex-none overflow-hidden", className)}
    >
      <rect width="32" height="32" rx="9" fill="var(--rds-hyper-05)" />
      <path d="M-2 11C10 11 17.5 14 21.5 34" fill="none" stroke="var(--rds-white)" strokeWidth="5" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-rds-logo leading-none font-bold tracking-[-0.01em] whitespace-nowrap text-rds-red",
        className,
      )}
    >
      Plummet
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-[0.5em] leading-none", className)}>
      <PlummetMark />
      <Wordmark />
    </span>
  );
}
