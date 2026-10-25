import { SiteNav } from "@/components/landing/site-nav";
import { AuthNotice } from "@/components/landing/auth-notice";
import { SmoothAnchors } from "@/components/landing/smooth-anchors";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { FinalCta } from "@/components/landing/final-cta";
import { SiteFooter } from "@/components/landing/site-footer";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-rds-sm focus:not-sr-only focus:absolute focus:top-rds-4 focus:left-rds-4 focus:z-200 focus:border focus:border-rds-border focus:bg-rds-dusk-09 focus:px-rds-4 focus:py-rds-2 focus:font-rds-sans focus:text-rds-body-sm focus:font-medium focus:text-rds-fg"
      >
        Skip to content
      </a>

      <SmoothAnchors />
      <SiteNav />
      <AuthNotice />
      <main id="main">
        <Hero />
        <Features />
        <HowItWorks />
        <DashboardPreview />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
