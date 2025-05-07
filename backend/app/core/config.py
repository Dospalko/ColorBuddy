from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "ColorBuddy API"
    API_V1_PREFIX: str = "/api" # Changed from /api/v1 for simplicity, adjust if needed

    # CORS settings
    CORS_ORIGINS: List[str] = [
        "http://localhost",
        "http://localhost:5173",
        # Add your deployed frontend URL here in production
    ]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]

    # Image processing settings
    MAX_IMAGE_UPLOAD_SIZE_MB: int = 5  # Max image size in MB
    DEFAULT_PALETTE_SIZE: int = 6     # Default number of colors to extract/generate

    # For Stage 3 (AI Palette Generation) - Keep these commented out or provide defaults if not used
    # OPENAI_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8', extra='ignore')

settings = Settings()