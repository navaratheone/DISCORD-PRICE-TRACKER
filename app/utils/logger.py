from __future__ import annotations

from typing import cast

import structlog

BoundLogger = structlog.stdlib.BoundLogger


def get_logger(name: str | None = None) -> BoundLogger:
    return cast(BoundLogger, structlog.get_logger(name))
