# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Discord server members and admins who hunt deals together. They add the bot to a server, track products with slash commands, and want the channel pinged the moment a price drops or a sold-out item returns. They visit the web dashboard, signed in with Discord, to check their servers, watches, alert history and price charts.

## Product Purpose

Plummet is a Discord bot that watches product prices across Amazon, eBay, Walmart, AliExpress, Best Buy, Target and most stores in between, then posts to a server's channel on a drop, a target price or a restock. The web dashboard is read-only: the bot does the tracking, the dashboard shows the receipts. Success is a server that never overpays because the alert arrived first.

## Positioning

Discord-first: every watch is created and tuned from slash commands inside the server where the deal will be shared, and a link is all a member gives it. A tiered scraper (structured data, per-site adapters, then a stealth browser) resolves prices on sites that try to hide them.

## Operating Context

- Slash commands: `/track <url>`, `/list`, `/info <id>`, `/watch <id> threshold|alert|pause|refresh|channel|role`, `/untrack <id>`, `/config show`.
- Sign-in and bot install run through Discord OAuth2 on the API (`/auth/discord/login`, `/auth/discord/bot`).
- Dashboard routes: `/dashboard` (servers), `/dashboard/servers/[guildId]` (watches), `/dashboard/watches/[watchId]` (product, price history 7d/30d/90d, alert rules, alert log).

## Capabilities and Constraints

- Alerts: price drop, target threshold, back in stock; per-watch channel and role overrides; pause and refresh.
- Prices are kept in native currency and converted on display, with per-server region defaults.
- The dashboard never edits watches; all changes happen in Discord.
- Undecided: pricing and plans (the landing says free to start, no card).

## Brand Commitments

- Name: Plummet (renamed from "Price Tracker" on 2026-10-24 at the user's request; the name comes from the package, `plummet-dashboard`). The wordmark shows it in the navbar and footer; the hero leads with the statement "Watch prices plummet" instead, its last word falling letter by letter.
- Mark: the old TrackerMark was removed on 2026-10-24; on 2026-10-26 the user asked for a new app icon. It is a hyper-red tile crossed by one heavy white price line that comes in level and falls out through the floor (`PlummetMark` in `components/landing/logo.tsx`). It is locked up with the red wordmark in the navbar, footer and dashboard bar. Still no favicon (the user's choice). The bot mascot (`public/bot.png`) is no longer shown on the site.
- Visual world: the Redis-era Property Agent landing (PropertyAgent commit `4d23a12^`), adopted by the user on 2026-10-24. Display face and wordmark: Unbounded (SIL OFL), the wordmark and closing statement at Bold, the hero statement at Black (pushed heavier at the user's request the same day), adopted on 2026-10-26 when the user asked for discord.com's Ginto-style headline type. ABC Ginto is licensed to Discord, so Unbounded was picked as the closest open match from a side-by-side against it. It replaces Mona Sans Black expanded (the user's 2026-10-25 pick over Public Stunt).

## Evidence on Hand

- Landing demo data is illustrative: the hero's Discord recording (the Deal Hunters HQ server, its members mara and jules, every message and price in it), the price ticker, the console replies and the dashboard preview are examples, not live data.
- No testimonials, customer counts or benchmarks exist; none may be invented.
