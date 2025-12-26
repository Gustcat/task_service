from pathlib import Path
from typing import Annotated

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"


class Settings(BaseSettings):
    db_user: Annotated[str, Field(alias="POSTGRES_USER")] = "user"
    db_pass: Annotated[str, Field(alias="POSTGRES_PASSWORD")] = "password"
    db_port: Annotated[str, Field(alias="POSTGRES_PORT")] = "5432"
    db_name: Annotated[str, Field(alias="POSTGRES_DB")] = "db"
    db_echo: Annotated[bool, Field(alias="DB_ECHO")] = False
    db_host: Annotated[str, Field(alias="POSTGRES_HOST")] = "localhost"

    http_host: Annotated[str, Field(alias="HTTP_HOST")] = "localhost"
    http_port: Annotated[int, Field(alias="HTTP_PORT")] = 8080

    frontend_host: Annotated[str, Field(alias="FRONTEND_HOST")] = "localhost"
    frontend_port: Annotated[int, Field(alias="FRONTEND_PORT")] = 5173

    model_config = SettingsConfigDict(
        env_file=ENV_PATH, env_file_encoding="utf-8", extra="ignore"
    )

    @property
    def real_database_url(self):
        return f"postgresql+asyncpg://{self.db_user}:{self.db_pass}@{self.db_host}:{self.db_port}/{self.db_name}"


settings = Settings()
