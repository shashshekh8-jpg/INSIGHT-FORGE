from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.orchestration.graph import tri_brain_app
import json

router = APIRouter()

@router.get("/ask")
async def process_query(query: str):
    """Enable real-time Cognitive Streaming via Server-Sent Events (SSE)"""
    async def event_generator():
        try:
            # Stream events from the LangGraph cyclic loop
            async for event in tri_brain_app.astream({"query": query, "errors": [], "iteration_count": 0}):
                yield f"data: {json.dumps(event)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")
