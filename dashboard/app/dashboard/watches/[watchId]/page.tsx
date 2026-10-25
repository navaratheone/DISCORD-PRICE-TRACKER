"use client";

import Image from "next/image";
import { use, useMemo, useState } from "react";
import { ExternalLink, ImageOff } from "lucide-react";
import {
  getSnapshots,
  getWatch,
  type AlertRow,
  type AlertRules,
} from "@/lib/api";
import { useAsync } from "@/lib/use-async";
import { Chip } from "@/components/landing/chip";
import {
  EmptyState,
  ErrorPanel,
  Skeleton,
  Spinner,
} from "@/components/dashboard/states";
import {
  formatDate,
  formatPrice,
  PageHeader,
  StatusPill,
  StockPill,
} from "@/components/dashboard/page-header";
import { PriceChart } from "@/components/dashboard/price-chart";

const RANGES = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
] as const;

export default function WatchPage({
  params,
}: {
  params: Promise<{ watchId: string }>;
}) {
  const { watchId } = use(params);
  const [days, setDays] = useState(30);
  const watch = useAsync(() => getWatch(watchId), [watchId]);

  const range = useMemo(() => {
    const to = new Date();
    const from = new Date(to.getTime() - days * 86_400_000);
    return { from: from.toISOString(), to: to.toISOString() };
  }, [days]);

  const snaps = useAsync(
    () => getSnapshots(watchId, range),
    [watchId, range.from, range.to],
  );

  if (watch.loading) {
    return (
      <>
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-rds-6 h-40 w-full" />
        <Skeleton className="mt-rds-6 h-64 w-full" />
      </>
    );
  }
  if (watch.error || !watch.data) {
    return (
      <>
        <PageHeader
          meta="Watch"
          title="Details"
          back={{ href: "/dashboard", label: "All servers" }}
        />
        <ErrorPanel error={watch.error} onRetry={watch.reload} />
      </>
    );
  }

  const { product, alertRules, alerts, isActive, paused } = watch.data;

  return (
    <>
      <PageHeader
        meta={product.domain}
        title={product.title ?? "Untitled product"}
        back={{
          href: `/dashboard/servers/${watch.data.guildId}`,
          label: "Back to server",
        }}
      >
        <StatusPill isActive={isActive} paused={paused} />
      </PageHeader>

      <section className="rds-glass mb-rds-7 flex flex-col gap-rds-6 rounded-rds-lg p-rds-6 max-md:p-rds-5 sm:flex-row">
        <div className="grid h-32 w-32 shrink-0 place-items-center overflow-hidden rounded-rds-md border border-rds-dusk bg-rds-midnight/60">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt=""
              width={128}
              height={128}
              className="h-full w-full object-contain"
              unoptimized
            />
          ) : (
            <ImageOff className="h-8 w-8 text-rds-dusk-50" strokeWidth={1.5} aria-hidden />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-rds-4 gap-y-rds-2">
            <span className="rds-tnum font-rds-sans text-[36px] leading-none font-light tracking-[-0.02em] text-rds-fg">
              {formatPrice(product.lastPrice, product.currency)}
            </span>
            <StockPill inStock={product.inStock} />
          </div>

          <dl className="mt-rds-5 grid grid-cols-2 gap-x-rds-5 border-t border-rds-dusk sm:grid-cols-3">
            <Meta label="Brand" value={product.brand ?? "—"} />
            <Meta label="Domain" value={product.domain} />
            <Meta label="Last scraped" value={formatDate(product.lastScrapedAt)} />
            {product.lastScrapeStatus && (
              <Meta label="Scrape status" value={product.lastScrapeStatus} />
            )}
            <Meta label="Tracking since" value={formatDate(watch.data.createdAt)} />
          </dl>

          <a
            href={product.sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="rds-btn rds-btn--secondary rds-btn--sm mt-rds-5"
          >
            View on {product.domain}
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          </a>
        </div>
      </section>

      <section className="mb-rds-7">
        <div className="mb-rds-4 flex flex-wrap items-center justify-between gap-rds-3">
          <h2 className="font-rds-sans text-rds-h-xs font-normal text-rds-fg">Price history</h2>
          <div className="flex gap-rds-2" role="group" aria-label="Range">
            {RANGES.map((r) => (
              <button
                key={r.label}
                type="button"
                onClick={() => setDays(r.days)}
                aria-pressed={days === r.days}
                className="rds-tab rds-tab--sm"
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {snaps.loading ? (
          <div className="rds-glass grid h-[240px] place-items-center rounded-rds-lg">
            <Spinner label="Loading history" />
          </div>
        ) : snaps.error ? (
          <ErrorPanel error={snaps.error} onRetry={snaps.reload} />
        ) : (
          <PriceChart
            points={snaps.data?.points ?? []}
            currency={snaps.data?.currency ?? product.currency}
          />
        )}
      </section>

      <section className="mb-rds-7">
        <h2 className="mb-rds-4 font-rds-sans text-rds-h-xs font-normal text-rds-fg">Alert rules</h2>
        <AlertRuleChips rules={alertRules} />
      </section>

      <section>
        <h2 className="mb-rds-4 font-rds-sans text-rds-h-xs font-normal text-rds-fg">Alert log</h2>
        <AlertLog alerts={alerts} currency={product.currency} />
      </section>
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-b border-rds-dusk py-rds-3">
      <dt className="rds-label rds-label--xs">{label}</dt>
      <dd className="mt-rds-1 truncate font-rds-sans text-rds-body-sm text-rds-dusk-10">{value}</dd>
    </div>
  );
}

function formatRuleValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "on" : "off";
  return String(v);
}

function AlertRuleChips({ rules }: { rules: AlertRules }) {
  const entries = Object.entries(rules).filter(
    ([, v]) => v !== null && v !== undefined && v !== false,
  );
  if (entries.length === 0) {
    return <EmptyState title="No alert rules configured for this watch." />;
  }
  return (
    <div className="flex flex-wrap gap-rds-2">
      {entries.map(([k, v]) => (
        <Chip key={k}>
          <span>{k}</span>
          <span className="rds-tnum text-rds-fg">{formatRuleValue(v)}</span>
        </Chip>
      ))}
    </div>
  );
}

function AlertLog({
  alerts,
  currency,
}: {
  alerts: AlertRow[];
  currency: string | null;
}) {
  if (alerts.length === 0) {
    return <EmptyState title="No alerts have fired for this watch yet." />;
  }
  return (
    <ul className="rds-glass rounded-rds-lg">
      {alerts.map((a) => (
        <li
          key={a.id}
          className="flex flex-wrap items-center justify-between gap-rds-3 border-b border-rds-dusk px-rds-5 py-rds-3 last:border-0"
        >
          <div className="min-w-0">
            <p className="font-rds-mono text-rds-label-sm tracking-rds-label uppercase text-rds-fg">
              {a.ruleType}
            </p>
            <p className="rds-tnum mt-rds-1 font-rds-mono text-rds-body-xs text-rds-dusk-30">
              {formatDate(a.triggeredAt)}
            </p>
          </div>
          <div className="flex items-center gap-rds-3">
            <span className="rds-tnum font-rds-mono text-rds-body-sm text-rds-dusk-30">
              {formatPrice(a.previousPrice, currency)}
              <span aria-hidden className="px-1.5 text-rds-dusk-50">→</span>
              <span className="text-rds-fg">{formatPrice(a.newPrice, currency)}</span>
            </span>
            <Chip size="sm">{a.deliveryStatus}</Chip>
          </div>
        </li>
      ))}
    </ul>
  );
}
