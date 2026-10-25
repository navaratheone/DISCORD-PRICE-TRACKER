---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/dashboard/layout.tsx"]
---

# Landing (/) and dashboard

Scope: the landing page `/` (Persuade) and the signed-in dashboard `/dashboard/**` (Operate), one visual world across both. Visitor: a Discord member deciding whether to add the bot; a signed-in member checking watches and alerts.

Constraints: every working link, interaction and data state stays (nav anchors, invite and login URLs, auth notice, command console tabs, dashboard states). Removed at the user's request (2026-10-24): eyebrows and HUD chrome, the hero spec line and note, the announcement bar, the console's decorative labels, every logo mark and the favicon, the mascot. Product renamed Plummet. Display face and wordmark: Mona Sans Black, expanded (user's pick, 2026-10-25). From 769px every landing section is one screen tall.

## Direction contract

THESIS: The Redis-era Property Agent landing (PropertyAgent `4d23a12^`), pinned by the user, worn by Plummet: a lit instrument panel on one midnight ground. Refuses the old brutalist cyan HUD and any near-black-plus-neon page.

OWN-WORLD: #091A23 ground end to end; Dusk ramp hairlines (#163341); hyper red #FF4438 for action, link, focus (maroon fill inside a red ring); electric yellow #DCFF1E for emphasis, peak, active, selection. Glass cards (Dusk 09 at 56%), edgeless, travelling red/yellow conic stroke on hover. Mona Sans Black expanded uppercase statements and wordmark, Space Grotesk workhorse, Space Mono labels at 1.5px. Radii 4/5/10.

STORY: Track any product; your server hears the drop first. The visitor watches a price plummet and its alert land in #deal-alerts, then sees the toolkit, the console proving the commands, the dashboard receipts, and adds the bot.

FIRST VIEWPORT: a plain full-width midnight bar fixed at the top with no rule under it, 60px and compact, within the centred container: the red Plummet wordmark on the left, the three links at the true centre, the actions on the right; the price terrain behind at a quarter opacity; one-line display statement WATCH PRICES PLUMMET at four fifths of the reference statement size, PLUMMET in red with its letters falling on an accelerating curve; 20px lede; a macOS window, tilted back and settling flat on scroll, playing a recording of Plummet in a themed Discord server (/track typed and answered, the drop alert landing with its @deal-hunters mention and reactions); primary Add to Discord + secondary How it works; the drops and restocks rail; scroll cue in the corner. One screen tall.

FORM: pinned direction, PA landing grammar: hero pair, two-jobs bento, features stage with lamp column, words-and-panel dashboard section, closing statement on the lattice, footer; each section one screen from 769px. seed: none (unavailable)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
