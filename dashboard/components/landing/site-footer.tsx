import { Wordmark } from "./logo";
import { Button } from "./buttons";
import { Container } from "./section";
import { inviteUrl } from "@/lib/api";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Dashboard", href: "#dashboard" },
      { label: "How it works", href: "#how" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Discord", href: "/invite" },
      { label: "X", href: "https://x.com" },
      { label: "GitHub", href: "https://github.com" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-rds-dusk bg-rds-bg pt-rds-section-lg pb-rds-section-lg">
      <Container>
        <div className="flex flex-col gap-rds-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-[320px]">
            <a href="#top" aria-label="Plummet, back to top" className="inline-block text-[20px] hover:no-underline">
              <Wordmark />
            </a>
            <p className="mt-rds-4 font-rds-sans text-rds-body-sm text-rds-fg-muted">
              Price-drop alerts, straight to Discord.
            </p>
          </div>
          <Button href={inviteUrl} theme="primary" size="lg" className="self-start md:self-auto">
            Add to Discord
          </Button>
        </div>
      </Container>
    </footer>
  );
}
