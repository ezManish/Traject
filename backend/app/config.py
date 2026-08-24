import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    nvidia_api_key: str = ""
    nvidia_api_base: str = "https://integrate.api.nvidia.com/v1"
    nvidia_model: str = "llama-3.3-nemotron-super-49b-v1.5"
    nvidia_embed_model: str = "nemotron-3-embed-1b"
    database_url: str = "sqlite:///./traject.db"
    replay_tick_seconds: float = 2.0

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
