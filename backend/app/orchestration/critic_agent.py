from groq import Groq
from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)

def self_correct_code(failed_code: str, error_message: str, schema: str) -> str:
    """Reflexion agent to rewrite failed SQL or Python code"""
    prompt = f"The following code failed: {failed_code}. Error: {error_message}. Schema: {schema}. Rewrite it correctly. Return ONLY raw code."
    
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama3-70b-8192",
        temperature=0.0,
    )
    
    return response.choices[0].message.content
