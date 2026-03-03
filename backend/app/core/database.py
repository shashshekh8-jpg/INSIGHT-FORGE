import duckdb
from app.core.config import settings

# Global Singleton connection to prevent OOM errors
db_instance = duckdb.connect(database=':memory:')

def init_db():
    """Materialize dataset once during startup to preserve RAM limits"""
    db_instance.execute(f"CREATE TABLE IF NOT EXISTS transactions AS SELECT * FROM read_csv_auto('{settings.DATASET_PATH}')")

def get_db():
    return db_instance
