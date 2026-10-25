"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import {
  Crosshair,
  Settings2,
  Terminal,
  Eye,
  Check,
  Pause,
  RefreshCw,
  Hash,
  AtSign,
  BellPlus,
} from "lucide-react";
import { Reveal } from "./reveal";
import { Container } from "./section";

type IconType = typeof Crosshair;

function Cell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rds-cell">
      <p className="rds-cell-label">{label}</p>
      <p className="rds-cell-value" data-accent={accent || undefined}>
        {value}
      </p>
    </div>
  );
}

function Cells({ children }: { children: ReactNode }) {
  return <div className="rds-cells">{children}</div>;
}

function StatusLine({ icon: Icon, children }: { icon: IconType; children: string }) {
  return (
    <p className="rds-con-status">
      <Icon strokeWidth={1.5} aria-hidden />
      {children}
    </p>
  );
}

function Product() {
  return <p className="rds-con-product">Sony WH-1000XM5 Wireless</p>;
}

function Price({ value, note, accent }: { value: string; note: string; accent: "value" | "note" }) {
  return (
    <p className="rds-con-price">
      <b data-accent={accent === "value" || undefined}>{value}</b>
      <span data-accent={accent === "note" || undefined}>{note}</span>
    </p>
  );
}

const HELP_ROWS = [
  { cmd: "/track <url>", desc: "start watching a product" },
  { cmd: "/list", desc: "your active watches" },
  { cmd: "/info <id>", desc: "full detail + price chart" },
  { cmd: "/watch <id> threshold", desc: "set a target price" },
  { cmd: "/untrack <id>", desc: "stop watching" },
  { cmd: "/config show", desc: "view server setup" },
];

type Entry = { cmd: string; arg: string; output: ReactNode };

const DATA: Record<string, Entry> = {
  track: {
    cmd: "/track",
    arg: "url: amazon.com/…/wh-1000xm5",
    output: (
      <>
        <StatusLine icon={Check}>Tracking started</StatusLine>
        <Product />
        <Price value="$349.99" note="in stock" accent="note" />
        <Cells>
          <Cell label="Watch ID" value="u7X2B3C" />
          <Cell label="Store" value="Amazon · US" />
          <Cell label="Alerts" value="drop · restock" accent />
          <Cell label="Target" value="not set" />
        </Cells>
      </>
    ),
  },
  config: {
    cmd: "/config",
    arg: "show",
    output: (
      <>
        <StatusLine icon={Settings2}>Server config</StatusLine>
        <Cells>
          <Cell label="Tracker role" value="@deal-team" />
          <Cell label="Alert channel" value="#deal-alerts" />
          <Cell label="Mention role" value="@deal-hunters" />
          <Cell label="Region" value="US" />
          <Cell label="Watches" value="12 / 25" accent />
          <Cell label="Status" value="ready" accent />
        </Cells>
      </>
    ),
  },
  help: {
    cmd: "/help",
    arg: "",
    output: (
      <>
        <StatusLine icon={Terminal}>Commands</StatusLine>
        <ul className="rds-records">
          {HELP_ROWS.map((h) => (
            <li key={h.cmd} className="rds-record">
              <span className="rds-record-key">{h.cmd}</span>
              <span className="rds-record-label">{h.desc}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  "watch.threshold": {
    cmd: "/watch",
    arg: "u7X2 threshold 250",
    output: (
      <>
        <StatusLine icon={Check}>Threshold set</StatusLine>
        <Product />
        <Price value="$250.00" note="target price" accent="value" />
        <p className="rds-con-text">
          Pings the channel when it drops to <b>$250.00</b> or below.
        </p>
        <Cells>
          <Cell label="Watch ID" value="u7X2B3C" />
          <Cell label="Was" value="any drop" />
          <Cell label="Alerts" value="drop · threshold · restock" accent />
          <Cell label="Status" value="active" />
        </Cells>
      </>
    ),
  },
  "watch.alert": {
    cmd: "/watch",
    arg: "u7X2 alert add threshold",
    output: (
      <>
        <StatusLine icon={BellPlus}>Rule added</StatusLine>
        <p className="rds-con-text">
          Threshold alerts are now <b>on</b> for this watch.
        </p>
        <Cells>
          <Cell label="Subscribed" value="drop · threshold · restock" accent />
          <Cell label="Watch ID" value="u7X2B3C" />
          <Cell label="Product" value="Sony WH-1000XM5" />
          <Cell label="Status" value="active" />
        </Cells>
      </>
    ),
  },
  "watch.pause": {
    cmd: "/watch",
    arg: "u7X2 pause",
    output: (
      <>
        <StatusLine icon={Pause}>Watch paused</StatusLine>
        <p className="rds-con-text">
          Scraping and alerts are paused. Nothing fires until you resume.
        </p>
        <Cells>
          <Cell label="Watch ID" value="u7X2B3C" />
          <Cell label="Product" value="Sony WH-1000XM5" />
          <Cell label="State" value="paused" />
          <Cell label="Resume" value="/watch u7X2 resume" accent />
        </Cells>
      </>
    ),
  },
  "watch.refresh": {
    cmd: "/watch",
    arg: "u7X2 refresh",
    output: (
      <>
        <StatusLine icon={RefreshCw}>Rechecked now</StatusLine>
        <Product />
        <Price value="$341.50" note="checked just now" accent="value" />
        <Cells>
          <Cell label="Was" value="$349.99" />
          <Cell label="Now" value="$341.50" accent />
          <Cell label="Scrape tier" value="adapter" />
          <Cell label="Stock" value="in stock" />
        </Cells>
      </>
    ),
  },
  "watch.channel": {
    cmd: "/watch",
    arg: "u7X2 channel #price-drops",
    output: (
      <>
        <StatusLine icon={Hash}>Alerts rerouted</StatusLine>
        <p className="rds-con-text">
          This watch now posts to <b>#price-drops</b>, not the server default.
        </p>
        <Cells>
          <Cell label="Watch ID" value="u7X2B3C" />
          <Cell label="Channel" value="#price-drops" accent />
          <Cell label="Scope" value="this watch only" />
          <Cell label="Status" value="active" />
        </Cells>
      </>
    ),
  },
  "watch.role": {
    cmd: "/watch",
    arg: "u7X2 role @deal-hunters",
    output: (
      <>
        <StatusLine icon={AtSign}>Mention set</StatusLine>
        <p className="rds-con-text">
          Pings <b>@deal-hunters</b> whenever this watch fires.
        </p>
        <Cells>
          <Cell label="Watch ID" value="u7X2B3C" />
          <Cell label="Mention" value="@deal-hunters" accent />
          <Cell label="Scope" value="this watch only" />
          <Cell label="Status" value="active" />
        </Cells>
      </>
    ),
  },
};

const MODULES: { key: string; name: string; tagline: string; icon: IconType }[] = [
  { key: "track", name: "Track", tagline: "Start a watch", icon: Crosshair },
  { key: "config", name: "Config", tagline: "Set up the server", icon: Settings2 },
  { key: "help", name: "Help", tagline: "Every command", icon: Terminal },
  { key: "watch.threshold", name: "Watch", tagline: "Tune a watch", icon: Eye },
];

const WATCH_SUBS: { key: string; name: string; desc: string }[] = [
  { key: "watch.threshold", name: "threshold", desc: "set a target price" },
  { key: "watch.alert", name: "alert", desc: "toggle a rule" },
  { key: "watch.pause", name: "pause", desc: "pause + resume" },
  { key: "watch.refresh", name: "refresh", desc: "scrape now" },
  { key: "watch.channel", name: "channel", desc: "reroute alerts" },
  { key: "watch.role", name: "role", desc: "set a mention" },
];

export function HowItWorks() {
  const [active, setActive] = useState<string>("track");
  const current = DATA[active];
  const watchOpen = active.startsWith("watch.");
  const lit = watchOpen ? MODULES.length - 1 : MODULES.findIndex((m) => m.key === active);
  const shown = MODULES[lit];

  return (
    <section id="how" aria-labelledby="how-heading" className="rds-section rds-feat rds-screen">
      <Container>
        <div className="rds-feat-grid">
          <div className="rds-feat-intro">
            <Reveal variant="wipe">
              <h2 id="how-heading" className="rds-feat-title">
                <span>Run it,</span> <span data-emphasis>see it</span>
              </h2>
            </Reveal>
            <Reveal as="p" variant="settle" delay={140} className="rds-feat-lede">
              No docs to read. Pick a module and watch the exact command, and
              exactly what the bot replies.
            </Reveal>
          </div>

          <Reveal variant="settle" delay={200} className="rds-feat-nav">
            <div role="tablist" aria-label="Command modules" className="rds-feat-lamps">
              {MODULES.map((m, i) => (
                <div key={m.key} className="rds-feat-step">
                  <button
                    type="button"
                    role="tab"
                    id={`how-tab-${m.name.toLowerCase()}`}
                    aria-selected={i === lit}
                    aria-controls="how-console"
                    aria-label={`${m.name}: ${m.tagline}`}
                    title={m.name}
                    data-state={i === lit ? "active" : i < lit ? "done" : "next"}
                    onClick={() => setActive(m.key)}
                    className="rds-feat-lamp"
                  >
                    <m.icon strokeWidth={1.5} aria-hidden />
                  </button>
                  {i < MODULES.length - 1 ? (
                    <span aria-hidden className="rds-feat-wire">
                      <i style={{ "--t": i < lit ? 1 : 0 } as CSSProperties} />
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </Reveal>

          <div className="rds-feat-copy">
            <div key={shown.name} className="rds-panel">
              <h3 className="rds-feat-name">
                <span aria-hidden className="rds-feat-icon">
                  <shown.icon strokeWidth={1.5} />
                </span>
                {shown.name}
              </h3>
              <p className="rds-feat-desc">{shown.tagline}</p>
            </div>

            <div className="rds-subs">
              <p className="rds-fig-head normal-case">/watch</p>
              <div role="tablist" aria-label="Watch subcommands" className="rds-subs-list">
                {WATCH_SUBS.map((sub) => (
                  <button
                    key={sub.key}
                    type="button"
                    role="tab"
                    aria-selected={sub.key === active}
                    aria-controls="how-console"
                    onClick={() => setActive(sub.key)}
                    className="rds-sub"
                  >
                    <span className="rds-sub-key">{sub.name}</span>
                    <span className="rds-sub-label">{sub.desc}</span>
                    <span aria-hidden className="rds-dot" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Reveal variant="lift" delay={120} className="rds-feat-figure">
            <figure
              id="how-console"
              role="tabpanel"
              aria-labelledby={`how-tab-${shown.name.toLowerCase()}`}
              className="rds-con rds-glass rds-stroke m-0"
            >
              <div className="rds-con-cmd">
                <span aria-hidden className="text-rds-dusk-50">
                  $
                </span>
                <b>{current.cmd}</b>
                {current.arg && <span className="rds-con-arg">{current.arg}</span>}
                <span aria-hidden className="rds-caret" />
              </div>

              <div aria-hidden className="rds-con-rule">
                <i key={active} />
              </div>

              <div className="rds-con-from">
                <span className="rds-con-from-name">Plummet</span>
                <span className="rds-badge">App</span>
                <span className="rds-con-from-note max-xs:hidden">only you can see this</span>
              </div>

              <div key={active} className="rds-con-body rds-panel">
                {current.output}
              </div>
            </figure>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
