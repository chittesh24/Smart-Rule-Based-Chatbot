"""
Application Configuration
"""
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application
    APP_NAME: str = "Rule-Based Chatbot"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./chatbot.db"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    # Rules file
    RULES_FILE: str = os.path.join(os.path.dirname(__file__), "../../../rules/chatbot_rules.yaml")
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
