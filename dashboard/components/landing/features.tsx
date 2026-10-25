import {
  Boxes,
  BellRing,
  LineChart,
  PackageCheck,
  SlidersHorizontal,
  Globe,
  Link2,
  ArrowRight,
} from "lucide-react";
import { Chip } from "./chip";
import { Reveal } from "./reveal";
import { Container, Section } from "./section";
import { cn } from "@/lib/utils";

const SMALL = [
  {
    icon: BellRing,
    title: "Alerts that land where they should",
    body: "Route each watch to a channel and ping the right role. Threshold, target price, or any drop. No noise.",
  },
  {
    icon: LineChart,
    title: "Price history on every watch",
    body: "Every tracked product keeps a full price timeline, so you know whether a deal is actually a deal.",
  },
  {
    icon: PackageCheck,
    title: "Back-in-stock alerts",
    body: "Sold out? Plummet keeps watching and pings the moment inventory returns.",
  },
  {
    icon: SlidersHorizontal,
    title: "Rules per watch",
    body: "Target price, percent drop, region override, mute windows. Tune each product on its own terms.",
  },
  {
    icon: Globe,
    title: "Native currency and regions",
    body: "Prices stay in their real currency and convert on display, with per-server region defaults.",
  },
];

const GLYPH = "size-6 shrink-0 text-rds-icon-accent";

/** A link going in and a price coming out, drawn as the old figures were: hairline boxes on the glass. */
function ExtractionFlow() {
  return (
    <figure className="m-0">
      <div className="flex items-center gap-rds-3">
        <span className="flex min-w-0 flex-1 items-center gap-rds-2 rounded-rds-xs border border-rds-dusk-90 bg-white/[0.03] px-rds-3 py-[10px]">
          <Link2 className="size-4 shrink-0 text-rds-dusk-50" strokeWidth={1.5} aria-hidden />
          <span className="rds-tnum truncate font-rds-mono text-rds-body-xs text-rds-dusk-30">
            amazon.com/dp/B0C33XXL
          </span>
        </span>
        <ArrowRight className="size-4 shrink-0 text-rds-dusk-50" strokeWidth={1.5} aria-hidden />
        <span className="flex shrink-0 items-center rounded-rds-xs border border-rds-dusk-90 bg-white/[0.03] px-rds-3 py-[10px]">
          <span className="rds-tnum font-rds-mono text-rds-body-sm text-rds-yellow">$278.00</span>
        </span>
      </div>
      <figcaption className="mt-rds-3 border-t border-rds-dusk pt-rds-3 font-rds-mono text-rds-body-xs text-pretty text-rds-dusk-30">
        Structured data, per-site adapters, then a stealth browser when a site
        fights back. Every tier, so a link is all you give it.
      </figcaption>
    </figure>
  );
}

export function Features() {
  return (
    <Section id="features" labelledBy="features-heading" className="rds-screen">
      <Container>
        <Reveal variant="wipe">
          <h2 id="features-heading" className="rds-jobs-title">
            Deal <em data-emphasis>toolkit</em>
          </h2>
        </Reveal>

        <Reveal as="p" variant="settle" delay={140} className="rds-jobs-lede">
          Everything your server needs to never overpay again.
        </Reveal>

        <div className="rds-toolkit mt-rds-6 grid gap-rds-4 md:grid-cols-2 xl:grid-cols-6">
          <Reveal variant="lift" className="min-w-0 md:col-span-2 xl:col-span-3 xl:row-span-2">
            <div className="rds-card rds-card--feature rds-glass rds-stroke rds-jobs-card h-full">
              <Boxes className={GLYPH} strokeWidth={1.5} aria-hidden />
              <h3 className="rds-jobs-name text-rds-h-xs">Drop a link from anywhere</h3>
              <p className="max-w-[46ch] font-rds-sans text-rds-body-md text-rds-fg-muted">
                Amazon, eBay, AliExpress, Walmart, Best Buy, Target and most
                stores in between. Paste a URL and Plummet resolves the
                price, even on sites that try to hide it.
              </p>
              <div className="mt-rds-2">
                <ExtractionFlow />
              </div>
              <div className="mt-auto flex flex-wrap gap-rds-2 border-t border-rds-dusk pt-rds-4">
                {["Amazon", "eBay", "Walmart", "AliExpress", "Best Buy", "Target"].map((s) => (
                  <Chip key={s} size="sm">
                    {s}
                  </Chip>
                ))}
              </div>
            </div>
          </Reveal>

          {SMALL.map((f, i) => (
            <Reveal
              key={f.title}
              variant="lift"
              delay={(i + 1) * 110}
              className={cn(
                "min-w-0",
                i < 2 ? "xl:col-span-3" : "xl:col-span-2",
                i === SMALL.length - 1 && "md:col-span-2 xl:col-span-2",
              )}
            >
              <div className="rds-card rds-card--feature rds-glass rds-stroke rds-jobs-card h-full">
                <f.icon className={GLYPH} strokeWidth={1.5} aria-hidden />
                <h3 className="rds-jobs-name">{f.title}</h3>
                <p className="font-rds-sans text-rds-body-sm text-rds-fg-muted">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
