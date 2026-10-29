import logging

from app.core.config import get_settings


def configure_logging() -> None:
    """Configure the root logger. Never log personal data (GDPR): log ids, not emails or names."""
    logging.basicConfig(
        level=get_settings().log_level,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
