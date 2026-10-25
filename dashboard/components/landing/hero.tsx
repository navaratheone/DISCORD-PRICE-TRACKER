import type { CSSProperties } from "react";
import { Button } from "./buttons";
import { DiscordDemo } from "./discord-demo";
import { TerrainField } from "./terrain";
import { PriceTicker } from "./price-ticker";
import { ScrollCue } from "./scroll-cue";
import { Container, Section } from "./section";
import { inviteUrl } from "@/lib/api";

export function Hero() {
  return (
    <Section id="top" spacingTop="none" spacingBottom="none" className="rds-hero">
      <TerrainField variant="hero" />

      <ScrollCue placement="corner" />

      <Container>
        <div className="rds-hero-stack">
          <div className="rds-hero-head">
            <h1 className="rds-hero-title">
              Watch prices{" "}
              <span className="rds-plummet">
                <span className="sr-only">plummet</span>
                {"plummet".split("").map((letter, i) => (
                  <span key={i} aria-hidden style={{ "--i": i } as CSSProperties}>
                    {letter}
                  </span>
                ))}
              </span>
            </h1>
            <p className="rds-hero-lede">
              Tracks any store and pings your server <em data-emphasis>the second it drops</em>.
            </p>
          </div>

          <DiscordDemo />

          <div className="rds-hero-actions">
            <Button href={inviteUrl} theme="primary">
              Add to Discord
            </Button>
            <Button href="#how" theme="secondary">
              How it works
            </Button>
          </div>

          <PriceTicker />
        </div>
      </Container>

    </Section>
  );
}
