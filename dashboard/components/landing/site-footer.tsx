import { Logo } from "./logo";
import { Button } from "./buttons";
import { Container } from "./section";
import { inviteUrl, loginUrl } from "@/lib/api";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Sign in", href: loginUrl },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-rds-dusk bg-rds-bg pt-rds-section-lg pb-rds-6">
      <Container>
        <div className="flex flex-col gap-rds-6 md:flex-row md:items-center md:justify-between">
          <div>
            <a
              href="#top"
              aria-label="Plummet, back to top"
              className="inline-flex rounded-rds-sm text-[22px] hover:no-underline md:text-[26px]"
            >
              <Logo />
            </a>
            <p className="mt-rds-4 font-rds-sans text-rds-body-md text-rds-fg-muted">
              Price-drop alerts, straight to Discord.
            </p>
          </div>
          <Button href={inviteUrl} theme="primary" size="lg" className="self-start md:self-auto">
            Add to Discord
          </Button>
        </div>

        <div className="mt-rds-7 flex flex-col-reverse gap-rds-4 border-t border-rds-dusk pt-rds-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-rds-mono text-rds-label-xs tracking-rds-label text-rds-dusk-50 uppercase">
            © {new Date().getFullYear()} Plummet
          </p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-rds-5 gap-y-rds-2">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-rds-sans text-rds-body-sm font-medium text-rds-fg-body transition-colors duration-rds-fast ease-rds-default hover:text-rds-fg"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
