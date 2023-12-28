import os
from dotenv import load_dotenv

ENV_FILE = "./.env"
load_dotenv(ENV_FILE)

DB_NAME = os.getenv("DB_NAME", 'postgres')
DB_USER = os.getenv("DB_USER", 'postgres')
DB_HOST = os.getenv("DB_HOST", 'localhost')
DB_PASSWORD = os.getenv("DB_PASSWORD", 'postgres')
DB_PORT = os.getenv("DB_PORT", 5432)
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
MEDIA_URL = os.getenv("MEDIA_URL")