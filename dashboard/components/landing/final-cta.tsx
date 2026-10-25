import { Button } from "./buttons";
import { Reveal } from "./reveal";
import { TerrainField } from "./terrain";
import { Container, Section } from "./section";
import { inviteUrl } from "@/lib/api";

/** The close answers the opening: a full screen over the price terrain, the statement a fifth larger than the hero's. */
export function FinalCta() {
  return (
    <Section id="add" labelledBy="add-heading" className="rds-close rds-screen">
      <TerrainField variant="close" />

      <Container className="rds-close-inner">
        <Reveal variant="wipe">
          <h2 id="add-heading" className="rds-close-title">
            Put a price <span className="rds-close-name">watchdog</span> in your server
          </h2>
        </Reveal>

        <Reveal as="p" variant="settle" delay={140} className="rds-close-lede">
          Free to start. No card. Add Plummet, run one command, and let
          your channel catch the next drop for you.
        </Reveal>

        <Reveal variant="settle" delay={280} className="rds-hero-actions rds-close-actions">
          <Button href={inviteUrl} theme="primary">
            Add to Discord
          </Button>
          <Button href="#how" theme="secondary">
            See how it works
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
