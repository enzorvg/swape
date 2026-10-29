from functools import lru_cache
from typing import Literal

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings, read from the environment (and the root .env in dev)."""

    model_config = SettingsConfigDict(
        env_file=(".env", "../../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    environment: Literal["dev", "test", "prod"] = "dev"
    log_level: str = "INFO"

    database_url: str = "postgresql+asyncpg://swape:swape@localhost:5434/swape"
    test_database_url: str = "postgresql+asyncpg://swape:swape@localhost:5435/swape_test"

    jwt_secret: SecretStr = SecretStr("dev-only-change-me")
    jwt_access_ttl_minutes: int = 15
    jwt_refresh_ttl_days: int = 30

    cors_origins: list[str] = ["http://localhost:5173"]


@lru_cache
def get_settings() -> Settings:
    return Settings()
