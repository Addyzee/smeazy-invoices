from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env", env_file_encoding="utf-8",
        case_sensitive=False,
    )
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    # allowed_origins: list[str] = ["http://localhost:5173"]
    at_key: str | None = None
    at_username: str | None = None
    database_name: str
    database_user: str
    database_password: str
    database_host: str
    database_port: int


settings = Settings(_env_file='.env', _env_file_encoding='utf-8') # type: ignore