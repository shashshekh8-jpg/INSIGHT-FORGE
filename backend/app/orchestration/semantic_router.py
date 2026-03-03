from app.engines.fast_brain import execute_duckdb
from app.engines.causal_engine import execute_dowhy
from app.engines.structural_engine import detect_toxic_corridors

def route_query(plan: str, original_query: str):
    plan_lower = plan.lower()
    
    if "structural" in plan_lower or "corridor" in plan_lower:
        result = detect_toxic_corridors()
        return "NetworkX (Structural Engine)", {"code": "nx.edge_betweenness_centrality(G)", "result": result}
    
    elif "comparative" in plan_lower or "cause" in plan_lower:
        result = execute_dowhy(original_query)
        return "DoWhy (Causal Engine)", {"code": "model.estimate_effect(identify_effect())", "result": result}
    
    else:
        sql_query, result = execute_duckdb(original_query)
        return "DuckDB (Fast Brain)", {"code": sql_query, "result": result}
