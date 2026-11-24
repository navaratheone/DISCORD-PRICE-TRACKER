from __future__ import annotations

from collections.abc import Iterable
from datetime import datetime
from decimal import Decimal
from typing import Any

from app.models.alert_event import AlertEvent
from app.models.product import Product
from app.models.server import Server
from app.models.watch import Watch
from app.utils.chart_builder import sparkline

COLOR_DROP = 0xE33D3D
COLOR_RESTOCK = 0x3B82F6
COLOR_THRESHOLD = 0x22C55E
COLOR_NEUTRAL = 0x5865F2
COLOR_ERROR = 0xE33D3D
COLOR_SUCCESS = 0x22C55E
COLOR_IN_STOCK = 0x22C55E
COLOR_OUT_OF_STOCK = 0xE33D3D

_RULE_TITLE = {
    "drop": "Price drop",
    "threshold": "Threshold hit",
    "restock": "Back in stock",
}
_RULE_COLOR = {
    "drop": COLOR_DROP,
    "threshold": COLOR_THRESHOLD,
    "restock": COLOR_RESTOCK,
}

_TITLE_MAX = 256


def _title(text: str) -> str:
    return text if len(text) <= _TITLE_MAX else text[: _TITLE_MAX - 1] + "…"


def alert_embed(event: AlertEvent, watch: Watch, product: Product) -> dict[str, Any]:
    rule = event.rule_type
    embed: dict[str, Any] = {
        "title": _title(
            f"{_RULE_TITLE.get(rule, rule.title())}: {product.title or product.source_url}"
        ),
        "url": product.source_url,
        "description": _format_change(event),
        "color": _RULE_COLOR.get(rule, COLOR_NEUTRAL),
        "footer": {"text": f"Price Tracker · id: {watch.short_id}"},
    }
    if product.image_url:
        embed["thumbnail"] = {"url": product.image_url}
    return embed


def watch_added(
    watch: Watch,
    product: Product,
    *,
    checking: bool = False,
    timed_out: bool = False,
) -> dict[str, Any]:
    scraped = product.last_scraped_at is not None
    if checking:
        description = "The watch is active. A price and availability check is in progress."
    elif timed_out:
        description = (
            "The latest check is taking longer than expected. Showing available details; "
            "use `/watch refresh` to try again."
        )
    elif product.last_scrape_status == "failed":
        description = (
            "The retailer couldn't provide product details just yet. "
            "Use `/watch refresh` to request another check."
        )
    elif product.last_scrape_status == "partial":
        description = "The first check finished, but some product details were unavailable."
    elif scraped:
        description = "Your first price check is complete."
    else:
        description = (
            "The first check hasn't completed yet. Use `/watch refresh` to request another check."
        )
    fields: list[dict[str, Any]] = [
        {"name": "🆔 ID", "value": f"`{watch.short_id}`", "inline": True},
        {"name": "💵 Price", "value": _price(product), "inline": True},
        {
            "name": "📦 Availability",
            "value": f"{_stock_emoji(product.last_known_in_stock)} "
            f"{_stock_text(product.last_known_in_stock)}",
            "inline": True,
        },
        {"name": "🏷️ Brand", "value": _short(product.brand or "Not available"), "inline": True},
        {"name": "🕒 Last check", "value": _relative_time(product.last_scraped_at), "inline": True},
        {"name": "🔔 Alerts", "value": _format_rules(watch.alert_rules), "inline": False},
    ]
    identifiers = _identifiers(product)
    if identifiers:
        fields.append({"name": "🔎 Product identifiers", "value": identifiers, "inline": False})
    footer = (
        f"id: {watch.short_id} · check in progress"
        if checking
        else f"/info {watch.short_id} · /watch refresh to check again"
        if scraped
        else f"id: {watch.short_id} · /watch refresh to retry"
    )
    embed: dict[str, Any] = {
        "author": {"name": _title(f"Price Tracker · ✅ Now tracking · {product.domain}")},
        "title": _title(product.title or product.source_url),
        "description": description,
        "url": product.source_url,
        "color": COLOR_SUCCESS,
        "fields": fields,
        "footer": {"text": footer},
    }
    if product.image_url:
        embed["thumbnail"] = {"url": product.image_url}
    return embed


def watch_list(
    rows: Iterable[tuple[Watch, Product]],
    *,
    page: int,
    pages: int,
    total: int,
    cap: int,
) -> list[dict[str, Any]]:
    embeds: list[dict[str, Any]] = []
    for watch, product in rows:
        active = watch.is_active and watch.paused_at is None
        status = "Active" if active else ("Paused" if watch.paused_at else "Inactive")
        details = [
            f"Retailer: {_short(product.domain, 64)}",
            f"Brand: {_short(product.brand or 'Not available', 48)}",
            f"Alerts: {_short(_format_rules(watch.alert_rules), 48)}",
            f"Status: {status} · checked {_relative_time(product.last_scraped_at)}",
        ]
        identifiers = _identifiers(product)
        if identifiers:
            details.append(f"IDs: {_short(identifiers, 48)}")
        fields = [
            {"name": "🆔 ID", "value": f"`{watch.short_id}`", "inline": True},
            {"name": "💵 Price", "value": _price(product), "inline": True},
            {
                "name": "📦 Availability",
                "value": f"{_stock_emoji(product.last_known_in_stock)} "
                f"{_stock_text(product.last_known_in_stock)}",
                "inline": True,
            },
        ]
        embed: dict[str, Any] = {
            "author": {"name": f"Tracked products · {total}/{cap} · page {page}/{pages}"},
            "title": _short(product.title or product.source_url, 80),
            "description": _short("\n".join(details), 280),
            "url": product.source_url,
            "color": _stock_color(product.last_known_in_stock) if active else COLOR_NEUTRAL,
            "fields": fields,
            "footer": {"text": f"/info {watch.short_id} · use /untrack to remove"},
        }
        if product.image_url:
            embed["thumbnail"] = {"url": product.image_url}
        embeds.append(embed)

    if embeds:
        return embeds
    return [
        {
            "author": {"name": "Price Tracker"},
            "title": "No products tracked yet",
            "description": "Start with `/track <url>` and your watches will appear here.",
            "color": COLOR_NEUTRAL,
            "footer": {"text": f"0/{cap} watches · page {page}/{pages}"},
        }
    ]


def watch_info(
    watch: Watch,
    product: Product,
    history: list[Decimal | None],
) -> dict[str, Any]:
    real = [v for v in history if v is not None]
    cur = product.currency or ""
    if real:
        history_value = (
            f"`{sparkline(history)}`\n"
            f"low **{_money(min(real))}** · high **{_money(max(real))}** {cur}".strip()
        )
    else:
        history_value = "_no price history yet_"

    embed: dict[str, Any] = {
        "author": {"name": _title(f"Price Tracker · {product.domain}")},
        "title": _title(product.title or product.source_url),
        "url": product.source_url,
        "color": _stock_color(product.last_known_in_stock),
        "fields": [
            {
                "name": "💵 Price",
                "value": f"{_price(product)} {_trend(history)}".strip(),
                "inline": True,
            },
            {
                "name": "📦 Stock",
                "value": f"{_stock_emoji(product.last_known_in_stock)} "
                f"{_stock_text(product.last_known_in_stock)}",
                "inline": True,
            },
            {"name": "🏷️ Brand", "value": product.brand or "Not available", "inline": True},
            {
                "name": "🕒 Last check",
                "value": _relative_time(product.last_scraped_at),
                "inline": True,
            },
            {"name": "🔔 Alerts", "value": _format_rules(watch.alert_rules), "inline": False},
            {"name": "📈 History", "value": history_value, "inline": False},
        ],
        "footer": {"text": f"Price Tracker · id: {watch.short_id}"},
    }
    identifiers = _identifiers(product)
    if identifiers:
        embed["fields"].append(
            {"name": "🔎 Product identifiers", "value": identifiers, "inline": False}
        )
    if product.image_url:
        embed["thumbnail"] = {"url": product.image_url}
    return embed


def config_show(server: Server, watch_count: int, watch_cap: int) -> dict[str, Any]:
    return {
        "author": {"name": "Price Tracker · Server settings"},
        "title": "Server configuration",
        "color": COLOR_NEUTRAL,
        "fields": [
            {"name": "Tracker role", "value": _mention("role", server.tracker_role_id)},
            {
                "name": "Alert channel",
                "value": _mention("channel", server.default_alert_channel_id),
            },
            {"name": "Mention role", "value": _mention("role", server.default_alert_role_id)},
            {"name": "Region", "value": server.region_default or "—"},
            {"name": "Usage", "value": f"{watch_count}/{watch_cap} watches"},
        ],
        "footer": {"text": f"{server.plan.title()} plan"},
    }


def setup_hint() -> dict[str, Any]:
    return {
        "author": {"name": "Price Tracker · Quick start"},
        "title": "Your server is ready to track prices",
        "description": (
            "Complete these steps to get your first alert:\n\n"
            "**1 · Choose who can manage watches**\n"
            "`/config role @role`\n\n"
            "**2 · Choose where alerts are delivered**\n"
            "`/config channel #channel`\n\n"
            "Run `/help` for all commands. Server setup requires **Manage Server**."
        ),
        "color": COLOR_SUCCESS,
        "footer": {"text": "Price Tracker · Product changes, clearly tracked"},
    }


def error_embed(message: str) -> dict[str, Any]:
    return {
        "author": {"name": "Price Tracker · Action needed"},
        "title": "That didn't work",
        "description": message,
        "color": COLOR_ERROR,
        "footer": {"text": "Check the details above, then try again"},
    }


def success_embed(
    title: str,
    description: str,
    *,
    footer: str = "Price Tracker · Done",
) -> dict[str, Any]:
    return {
        "author": {"name": "Price Tracker · Updated"},
        "title": title,
        "description": description,
        "color": COLOR_SUCCESS,
        "footer": {"text": footer},
    }


def help_embed(lines: list[str]) -> dict[str, Any]:
    return {
        "author": {"name": "Price Tracker · Command guide"},
        "title": "Price Tracker commands",
        "description": "\n".join(lines),
        "color": COLOR_NEUTRAL,
        "footer": {"text": "Use commands in a server where the tracker is installed"},
    }


def info_embed(message: str) -> dict[str, Any]:
    return {"description": message, "color": COLOR_NEUTRAL}


def _format_change(event: AlertEvent) -> str:
    if event.rule_type == "restock":
        return "Item is back in stock."
    prev = _money(event.previous_price)
    new = _money(event.new_price)
    if event.rule_type == "drop":
        return f"~~{prev}~~ → **{new}**"
    return f"Now at **{new}** (was {prev})"


def _format_rules(rules: dict[str, Any] | None) -> str:
    if not rules:
        return "No alerts configured"
    parts: list[str] = []
    for key in ("drop", "restock"):
        if rules.get(key):
            parts.append(key)
    threshold = rules.get("threshold")
    if threshold not in (None, False):
        parts.append(f"≤ {threshold}")
    return _short(", ".join(parts) or "No alerts configured")


def _money(value: Any) -> str:
    if value is None:
        return "—"
    return f"{value:.2f}" if isinstance(value, (int, float, Decimal)) else str(value)


def _price(product: Product) -> str:
    amount = _money(product.last_known_price)
    if amount == "—":
        return "—"
    return f"**{amount}** {product.currency or ''}".strip()


def _stock_emoji(in_stock: bool | None) -> str:
    return "🟢" if in_stock else ("🔴" if in_stock is False else "⚪")


def _stock_text(in_stock: bool | None) -> str:
    return "In stock" if in_stock else ("Out of stock" if in_stock is False else "Unknown")


def _stock_color(in_stock: bool | None) -> int:
    return (
        COLOR_IN_STOCK if in_stock else (COLOR_OUT_OF_STOCK if in_stock is False else COLOR_NEUTRAL)
    )


def _relative_time(value: datetime | None) -> str:
    if value is None:
        return "Not checked yet"
    return f"<t:{int(value.timestamp())}:R>"


def _identifiers(product: Product) -> str:
    identifiers = [
        f"{label} `{value}`"
        for label, value in (("ASIN", product.asin), ("GTIN", product.gtin), ("MPN", product.mpn))
        if value
    ]
    return _short(" · ".join(identifiers), 900)


def _short(text: str, limit: int = 1024) -> str:
    return text if len(text) <= limit else text[: limit - 1] + "…"


def _trend(history: list[Decimal | None]) -> str:
    real = [v for v in history if v is not None]
    if len(real) < 2 or real[-1] == real[-2]:
        return ""
    return "📉" if real[-1] < real[-2] else "📈"


def _mention(kind: str, value: int | None) -> str:
    if value is None:
        return "—"
    return f"<@&{value}>" if kind == "role" else f"<#{value}>"
