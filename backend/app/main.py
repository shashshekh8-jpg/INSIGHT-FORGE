from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router
from app.core.database import init_db
import time

app = FastAPI(title="InsightForge Decision Engine")

# CORS handled by Vercel proxy, but allowed here for flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.on_event("startup")
def startup_event():
    """Materialize the 20,000-row dataset into RAM safely on boot"""
    init_db()

@app.get("/api/ping")
async def keep_alive_ping():
    """Anti-Cold Start Endpoint for cron-job.org"""
    return {"status": "awake", "timestamp": time.time(), "message": "Tri-Brain active."}
