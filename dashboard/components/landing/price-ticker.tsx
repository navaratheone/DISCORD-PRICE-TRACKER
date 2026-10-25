import { ArrowDown, Box } from "lucide-react";
import { Marquee } from "./marquee";

type Tick =
  | { kind: "drop"; name: string; pct: string; price: string }
  | { kind: "stock"; name: string; price: string };

const TICKS: Tick[] = [
  { kind: "drop", name: "RTX 4080 Super", pct: "-18%", price: "$799" },
  { kind: "stock", name: "PS5 Slim Bundle", price: "$449" },
  { kind: "drop", name: "AirPods Pro 2", pct: "-24%", price: "$189" },
  { kind: "drop", name: 'LG C4 65"', pct: "-31%", price: "$1,296" },
  { kind: "stock", name: "Steam Deck OLED", price: "$549" },
  { kind: "drop", name: "Kindle Paperwhite", pct: "-22%", price: "$109" },
  { kind: "drop", name: "Dyson V15 Detect", pct: "-15%", price: "$549" },
  { kind: "stock", name: "Meta Quest 3", price: "$499" },
  { kind: "drop", name: "Nintendo Switch 2", pct: "-12%", price: "$399" },
  { kind: "drop", name: "Bose QC Ultra", pct: "-27%", price: "$309" },
];

function TickItem({ tick }: { tick: Tick }) {
  return (
    <span className="rds-tick" data-kind={tick.kind}>
      {tick.kind === "drop" ? (
        <ArrowDown strokeWidth={1.5} aria-hidden />
      ) : (
        <Box strokeWidth={1.5} aria-hidden />
      )}
      <span className="rds-tick-name">{tick.name}</span>
      {tick.kind === "drop" ? (
        <span className="rds-tick-pct">{tick.pct}</span>
      ) : (
        <span className="rds-tick-flag">restock</span>
      )}
      <span className="rds-tick-price">{tick.price}</span>
    </span>
  );
}

/** The rail that closes the hero: drops and restocks travelling past a still label, paused under the pointer. */
export function PriceTicker() {
  return (
    <div className="rds-rail">
      <p className="rds-rail-label">Drops · restocks</p>
      <Marquee label="Recent price drops and restocks" speed={28} className="rds-rail-window">
        {TICKS.map((tick) => (
          <TickItem key={tick.name} tick={tick} />
        ))}
      </Marquee>
    </div>
  );
}
