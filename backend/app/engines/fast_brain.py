from app.core.database import get_db

def execute_duckdb(nl_query: str):
    """Execute dynamic SQL against the globally materialized RAM table"""
    db = get_db()
    
    # For demo: Simple dynamic aggregation based on query
    generated_sql = f"SELECT SUM(amount_inr) as result FROM transactions WHERE fraud_flag = 1"
    result = db.execute(generated_sql).df().to_dict()
    
    return generated_sql, result
