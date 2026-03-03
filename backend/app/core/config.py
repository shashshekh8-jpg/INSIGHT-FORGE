import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Settings:
    PROJECT_NAME: str = "InsightForge Tri-Brain API"
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY")
    HUGGINGFACE_API_KEY: str = os.getenv("HUGGINGFACE_API_KEY")
    DATASET_PATH: str = os.path.join(BASE_DIR, "data", "demo_dataset.csv")

settings = Settings()

if not settings.GROQ_API_KEY or not settings.HUGGINGFACE_API_KEY:
    raise ValueError("Critical API keys missing. Check your .env file.")
