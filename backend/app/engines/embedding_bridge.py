import requests
import chromadb
from app.core.config import settings

API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-mpnet-base-v2"
HEADERS = {"Authorization": f"Bearer {settings.HUGGINGFACE_API_KEY}"}

def generate_and_store_embeddings(text_payload: list, doc_ids: list):
    """Offload heavy vector generation to Hugging Face to protect Koyeb RAM"""
    try:
        response = requests.post(API_URL, headers=HEADERS, json={"inputs": text_payload})
        response.raise_for_status()
        embeddings = response.json()
        return {"status": "success", "embeddings": embeddings, "doc_ids": doc_ids}
    except Exception as e:
        return {"error": str(e)}
