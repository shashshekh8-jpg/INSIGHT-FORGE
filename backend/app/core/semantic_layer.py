# Hardcoded truth anchors to prevent LLM hallucinations
BUSINESS_METRICS = {
    "high_risk_transaction": {
        "definition": "Any transaction where fraud_flag == 1 OR (amount_inr > 500000 AND verification_status == 'pending')",
        "sql_condition": "fraud_flag = 1 OR (amount_inr > 500000 AND verification_status = 'pending')"
    },
    "whale_user": {
        "definition": "A user whose total transaction volume exceeds 1,000,000 INR in a single session.",
        "sql_condition": "SUM(amount_inr) > 1000000"
    },
    "toxic_corridor_threshold": {
        "definition": "A sender-receiver state/bank pathway accounting for more than 15% of total flagged fraud volume.",
        "networkx_weight_filter": 0.15
    }
}

def get_metric_logic(metric_name: str) -> str:
    return BUSINESS_METRICS.get(metric_name, {}).get("sql_condition", "")
