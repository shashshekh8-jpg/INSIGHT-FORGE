from groq import Groq
from app.core.config import settings
from app.core.semantic_layer import BUSINESS_METRICS

client = Groq(api_key=settings.GROQ_API_KEY)

def generate_plan(user_query: str) -> str:
    schema_definition = "transaction_id, timestamp, amount_inr, sender_state, receiver_bank, device_type, network_type, verification_status, fraud_flag"
    
    system_prompt = f"""You are the Planner Agent for InsightForge. Decompose user queries into execution plans.

Schema: {schema_definition}
Strict Metrics: {BUSINESS_METRICS}

HUMAN-IN-THE-LOOP PROTOCOL:
If query is vague (e.g., "Is it bad?"), output "AMBIGUOUS" and explain what you need.
"""
    
    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_query}
        ],
        model="llama3-70b-8192",
        temperature=0.1,
    )
    
    return response.choices[0].message.content
