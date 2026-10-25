import { cn } from "@/lib/utils";

/** The wordmark: the display face at Black and expanded, in hyper red, the name alone. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-rds-logo leading-none font-black tracking-[-0.01em] whitespace-nowrap text-rds-red [font-stretch:125%]",
        className,
      )}
    >
      Plummet
    </span>
  );
}
