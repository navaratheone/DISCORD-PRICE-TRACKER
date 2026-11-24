from __future__ import annotations

import datetime
import uuid
from decimal import Decimal
from types import SimpleNamespace

from app.utils import embed_builder


def _watch(**kw):
    base = dict(
        short_id="ABCD1234",
        alert_rules={"drop": True, "restock": True, "threshold": "75.00"},
        paused_at=None,
        is_active=True,
        last_scraped_at=None,
    )
    base.update(kw)
    return SimpleNamespace(**base)


def _product(**kw):
    base = dict(
        id=uuid.uuid4(),
        title="Demo Widget",
        domain="example.com",
        source_url="https://example.com/p/1",
        image_url=None,
        brand=None,
        asin=None,
        gtin=None,
        mpn=None,
        currency="USD",
        last_known_price=Decimal("99.95"),
        last_known_in_stock=True,
        last_scraped_at=None,
        last_scrape_status=None,
    )
    base.update(kw)
    return SimpleNamespace(**base)


def test_watch_added_includes_short_id_and_rules() -> None:
    embed = embed_builder.watch_added(_watch(), _product())
    assert embed["color"] == embed_builder.COLOR_SUCCESS
    fields = {f["name"]: f["value"] for f in embed["fields"]}
    assert "`ABCD1234`" in fields["🆔 ID"]
    assert fields["💵 Price"] == "**99.95** USD"
    assert fields["📦 Availability"] == "🟢 In stock"
    assert "drop" in fields["🔔 Alerts"]
    assert "≤ 75.00" in fields["🔔 Alerts"]
    assert "underway" in embed["description"]


def test_watch_added_shows_all_scraped_product_details() -> None:
    product = _product(
        brand="Acme",
        asin="B012345678",
        gtin="1234567890123",
        mpn="WIDGET-1",
        image_url="https://example.com/image.jpg",
        last_scraped_at=datetime.datetime(2026, 1, 1),
        last_scrape_status="ok",
    )
    embed = embed_builder.watch_added(_watch(), product)
    fields = {field["name"]: field["value"] for field in embed["fields"]}
    assert fields["🏷️ Brand"] == "Acme"
    assert "ASIN" in fields["🔎 Product identifiers"]
    assert "GTIN" in fields["🔎 Product identifiers"]
    assert "MPN" in fields["🔎 Product identifiers"]
    assert embed["thumbnail"]["url"] == product.image_url
    assert "complete" in embed["description"]


def test_watch_added_reports_scrape_failures_with_a_recovery_action() -> None:
    product = _product(last_scraped_at=datetime.datetime(2026, 1, 1), last_scrape_status="failed")
    embed = embed_builder.watch_added(_watch(), product)
    assert "couldn't provide product details" in embed["description"]
    assert "/watch refresh" in embed["description"]


def test_watch_list_empty_state() -> None:
    embed = embed_builder.watch_list([], page=1, pages=1, total=0, cap=25)[0]
    assert "No products tracked" in embed["title"]
    assert embed["footer"]["text"].endswith("page 1/1")


def test_watch_list_renders_rows() -> None:
    product = _product(image_url="https://example.com/image.jpg", brand="Acme")
    embeds = embed_builder.watch_list([(_watch(), product)], page=1, pages=1, total=1, cap=25)
    assert len(embeds) == 1
    embed = embeds[0]
    fields = {field["name"]: field["value"] for field in embed["fields"]}
    assert fields["🆔 ID"] == "`ABCD1234`"
    assert "99.95" in fields["💵 Price"]
    assert "Brand: Acme" in embed["description"]
    assert embed["thumbnail"]["url"] == product.image_url


def test_watch_list_stays_within_discord_message_limits() -> None:
    rows = [
        (
            _watch(alert_rules={"threshold": "9" * 1000}),
            _product(
                title="Product " + "x" * 300,
                brand="Brand " + "x" * 300,
                asin="A" * 300,
                gtin="G" * 300,
                mpn="M" * 300,
                image_url="https://example.com/image.jpg",
            ),
        )
        for _ in range(10)
    ]
    embeds = embed_builder.watch_list(rows, page=1, pages=3, total=25, cap=25)
    assert len(embeds) == 10
    assert sum(_embed_text_length(embed) for embed in embeds) <= 6000
    assert all(embed.get("thumbnail", {}).get("url") for embed in embeds)


def test_watch_list_marks_paused() -> None:
    embed = embed_builder.watch_list(
        [(_watch(paused_at=datetime.datetime(2026, 1, 1)), _product())],
        page=1,
        pages=1,
        total=1,
        cap=25,
    )[0]
    assert "Status: Paused" in embed["description"]


def test_watch_info_includes_sparkline_field() -> None:
    embed = embed_builder.watch_info(
        _watch(), _product(), [Decimal("100"), Decimal("90"), Decimal("80")]
    )
    field_names = [f["name"] for f in embed["fields"]]
    assert "📈 History" in field_names
    assert "💵 Price" in field_names
    assert "🏷️ Brand" in field_names


def test_config_show_uses_dashes_for_unset() -> None:
    server = SimpleNamespace(
        tracker_role_id=None,
        default_alert_channel_id=None,
        default_alert_role_id=None,
        region_default=None,
        plan="free",
    )
    embed = embed_builder.config_show(server, watch_count=0, watch_cap=25)
    values = {f["name"]: f["value"] for f in embed["fields"]}
    assert values["Tracker role"] == "—"
    assert values["Usage"] == "0/25 watches"


def test_setup_hint_is_safe_for_dm() -> None:
    embed = embed_builder.setup_hint()
    assert "/config role" in embed["description"]


def _embed_text_length(embed: dict) -> int:
    parts = [
        embed.get("author", {}).get("name", ""),
        embed.get("title", ""),
        embed.get("description", ""),
        embed.get("footer", {}).get("text", ""),
    ]
    for field in embed.get("fields", []):
        parts.extend((field["name"], field["value"]))
    return sum(map(len, parts))
