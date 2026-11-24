import { ArrowDown, ArrowUp } from "lucide-react";
import { Reveal } from "./reveal";
import { Button } from "./buttons";
import { Container, Section } from "./section";
import { loginUrl } from "@/lib/api";

function PriceHistoryChart() {
  return (
    <svg
      viewBox="0 0 600 210"
      className="h-full w-full"
      role="img"
      aria-label="Price history for Sony WH-1000XM5 over 90 days"
    >
      {[40, 90, 140, 190].map((y) => (
        <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="var(--rds-dusk)" strokeWidth="1" />
      ))}

      <rect x="150" y="0" width="70" height="210" fill="var(--rds-dusk)" fillOpacity="0.7" />
      <rect x="430" y="0" width="40" height="210" fill="var(--rds-dusk)" fillOpacity="0.7" />

      <polyline
        points="0,70 70,76 150,64 220,96 300,120 380,150 430,176 470,168 540,184 600,182"
        fill="none"
        stroke="var(--rds-yellow)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      <rect x="534" y="178" width="12" height="12" fill="var(--rds-midnight)" stroke="var(--rds-yellow)" strokeWidth="2.5" />
      <g transform="translate(426,136)">
        <rect width="118" height="30" rx="4" fill="var(--rds-midnight)" stroke="var(--rds-dusk-90)" />
        <text x="12" y="20" fontSize="15" fill="var(--rds-yellow)" fontFamily="var(--rds-font-mono)">
          Lowest $278
        </text>
      </g>
    </svg>
  );
}

const WATCHES = [
  { name: "Sony WH-1000XM5", store: "Amazon", price: "$278.00", change: "-30%", down: true },
  { name: "RTX 4080 Super", store: "Best Buy", price: "$799.00", change: "-18%", down: true },
  { name: 'LG C4 OLED 65"', store: "Walmart", price: "$1,296", change: "-31%", down: true },
  { name: "Steam Deck OLED", store: "Steam", price: "$549.00", change: "+0%", down: false },
];

const COL = "font-rds-mono text-rds-label-xs tracking-rds-label uppercase text-rds-dusk-30";

export function DashboardPreview() {
  return (
    <Section id="dashboard" labelledBy="dashboard-heading" className="rds-screen">
      <Container>
        <div className="grid items-center gap-x-rds-8 gap-y-rds-7 xl:grid-cols-[5fr_7fr]">
          <div className="text-center xl:text-left">
            <Reveal variant="wipe">
              <h2 id="dashboard-heading" className="rds-jobs-title xl:mx-0 xl:text-left">
                The <em data-emphasis>dashboard</em>
              </h2>
            </Reveal>
            <Reveal as="p" variant="settle" delay={140} className="rds-jobs-lede xl:mx-0 xl:text-left">
              Sign in with Discord to see every watch, every alert, and the price
              history behind it. Read-only by design: the bot does the tracking,
              the dashboard shows you the receipts.
            </Reveal>
            <Reveal variant="settle" delay={280} className="mt-rds-6">
              <Button href={loginUrl} theme="secondary">
                Open the dashboard
              </Button>
            </Reveal>
          </div>

          <Reveal variant="lift" delay={120} className="mx-auto w-full max-w-[720px] min-w-0">
            <div className="rds-glass rds-stroke overflow-hidden rounded-rds-lg">
              
              <div className="flex items-center gap-rds-3 border-b border-rds-dusk px-rds-4 py-[10px]">
                <span aria-hidden className="flex gap-1.5">
                  <span className="size-2 rounded-full bg-rds-dusk-90" />
                  <span className="size-2 rounded-full bg-rds-dusk-90" />
                  <span className="size-2 rounded-full bg-rds-dusk-90" />
                </span>
                <span className="rds-tnum mx-auto max-w-full truncate rounded-rds-xs border border-rds-dusk bg-white/[0.03] px-rds-3 py-0.5 font-rds-mono text-rds-body-xxs text-rds-dusk-30">
                  pricetracker.bot/dashboard/deal-hunters-hq
                </span>
                <span aria-hidden className="w-[34px] max-sm:hidden" />
              </div>

              <div className="flex flex-wrap items-center gap-x-rds-4 gap-y-rds-2 border-b border-rds-dusk px-rds-4 py-[10px]">
                <span className="font-rds-sans text-rds-body-xs font-medium text-rds-fg">deal-hunters HQ</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {["Overview", "Watches", "Alerts", "Config"].map((t, i) => (
                    <span
                      key={t}
                      className="rds-tab rds-tab--sm cursor-default px-2 py-0.5 text-[10px]"
                      data-selected={i === 0 || undefined}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-3">
                
                <div className="border-b border-rds-dusk p-rds-4 sm:col-span-2 sm:border-r">
                  <div className="flex items-start justify-between gap-rds-3">
                    <div className="min-w-0">
                      <p className="truncate font-rds-sans text-rds-body-xs font-medium text-rds-fg">Sony WH-1000XM5</p>
                      <p className="rds-tnum mt-0.5 font-rds-mono text-rds-body-xxs text-rds-dusk-30">
                        90-day price history · Amazon
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="rds-tnum font-rds-sans text-[18px] leading-tight font-light text-rds-yellow">$278.00</p>
                      <p className="rds-tnum mt-0.5 flex items-center justify-end gap-1 font-rds-mono text-rds-body-xxs text-rds-yellow">
                        <ArrowDown className="size-3" strokeWidth={1.5} aria-hidden /> 30% in 90d
                      </p>
                    </div>
                  </div>
                  <div className="mt-rds-3 aspect-[600/210] w-full">
                    <PriceHistoryChart />
                  </div>
                  <div className={`mt-rds-2 flex items-center gap-rds-4 ${COL}`}>
                    <span className="flex items-center gap-1.5">
                      <span aria-hidden className="h-2 w-3 bg-rds-dusk" />
                      out of stock
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span aria-hidden className="h-0.5 w-3 bg-rds-yellow" />
                      price
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 border-b border-rds-dusk sm:grid-cols-1 sm:grid-rows-2">
                  <div className="border-r border-rds-dusk p-rds-4 sm:border-r-0 sm:border-b">
                    <p className={COL}>Active watches</p>
                    <p className="rds-tnum mt-rds-2 font-rds-sans text-[28px] leading-none font-light tracking-[-0.02em] text-rds-fg">48</p>
                    <p className="rds-tnum mt-rds-2 flex items-center gap-1 font-rds-mono text-rds-body-xxs text-rds-yellow">
                      <ArrowUp className="size-3" strokeWidth={1.5} aria-hidden /> 6 this week
                    </p>
                  </div>
                  <div className="p-rds-4">
                    <p className={COL}>Alerts this week</p>
                    <p className="rds-tnum mt-rds-2 font-rds-sans text-[28px] leading-none font-light tracking-[-0.02em] text-rds-fg">23</p>
                    <p className="rds-tnum mt-rds-2 font-rds-mono text-rds-body-xxs text-rds-dusk-30">avg drop 19%</p>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <div className={`hidden grid-cols-[2fr_1fr_1fr_0.7fr] gap-rds-4 border-b border-rds-dusk px-rds-4 py-[10px] sm:grid ${COL}`}>
                    <span>Product</span>
                    <span>Store</span>
                    <span>Price</span>
                    <span className="text-right">90d</span>
                  </div>
                  {WATCHES.map((w) => (
                    <div
                      key={w.name}
                      className="grid grid-cols-2 items-baseline gap-x-rds-4 gap-y-0.5 border-b border-rds-dusk px-rds-4 py-[9px] last:border-0 sm:grid-cols-[2fr_1fr_1fr_0.7fr]"
                    >
                      <span className="truncate font-rds-sans text-rds-body-xs font-medium text-rds-fg">{w.name}</span>
                      <span className="font-rds-mono text-rds-body-xxs text-rds-dusk-30 max-sm:text-right">{w.store}</span>
                      <span className="rds-tnum font-rds-mono text-rds-body-xs text-rds-dusk-10">{w.price}</span>
                      <span
                        className={`rds-tnum text-right font-rds-mono text-rds-body-xs ${
                          w.down ? "text-rds-yellow" : "text-rds-dusk-50"
                        }`}
                      >
                        {w.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
