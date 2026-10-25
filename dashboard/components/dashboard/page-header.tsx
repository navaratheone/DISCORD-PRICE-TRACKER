import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Chip } from "@/components/landing/chip";

/** The page's name, then what it is as data (who is signed in, the store), never a label above the heading. */
export function PageHeader({
  meta,
  title,
  back,
  children,
}: {
  meta: string;
  title: string;
  back?: { href: string; label: string };
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-rds-7 border-b border-rds-dusk pb-rds-6">
      {back && (
        <Link href={back.href} className="rds-back mb-rds-5">
          <ArrowLeft strokeWidth={1.5} aria-hidden />
          {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-rds-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="rds-page-title truncate">{title}</h1>
          <p className="rds-label mt-rds-3 truncate">{meta}</p>
        </div>
        {children && <div className="flex flex-wrap items-center gap-rds-2">{children}</div>}
      </div>
    </div>
  );
}

export function StockPill({ inStock }: { inStock: boolean | null }) {
  const label =
    inStock === null ? "Unknown" : inStock ? "In stock" : "Out of stock";
  return (
    <Chip size="sm" dot={inStock === null ? undefined : inStock ? "yellow" : "grey"}>
      {label}
    </Chip>
  );
}

export function StatusPill({
  isActive,
  paused,
}: {
  isActive: boolean;
  paused: boolean;
}) {
  const label = !isActive ? "Inactive" : paused ? "Paused" : "Active";
  return (
    <Chip size="sm" dot={!isActive ? undefined : paused ? "grey" : "yellow"}>
      {label}
    </Chip>
  );
}

export function AdminBadge({ isAdmin }: { isAdmin: boolean }) {
  if (!isAdmin) return null;
  return <span className="rds-badge">Admin</span>;
}

export function formatPrice(
  price: number | null,
  currency: string | null,
): string {
  if (price === null) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency ?? "USD",
      currencyDisplay: "narrowSymbol",
    }).format(price);
  } catch {
    return `${price.toFixed(2)}${currency ? ` ${currency}` : ""}`;
  }
}

export function formatDate(iso: string | null): string {
  if (!iso) return "Never";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
