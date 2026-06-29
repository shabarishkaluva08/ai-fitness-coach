"""
AI Gym & Fitness Assistant — FastAPI Application Entry Point.

This module configures:
  - CORS middleware for frontend communication
  - FastAPI lifespan for MongoDB connection management
  - Router mounting for all API endpoints

Run with:
    uvicorn main:app --reload --port 8000
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database.connection import connect_to_mongo, close_mongo_connection
from routers import dashboard, fitness, diet, chat, habits

# Load environment variables from .env file
load_dotenv()


# ──────────────────────────────────────────────
# Lifespan — manages MongoDB connection lifecycle
# ──────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown events.

    On startup: Connects to MongoDB.
    On shutdown: Closes the MongoDB connection gracefully.
    """
    print("[START] Starting AI Gym & Fitness Assistant...")
    await connect_to_mongo()
    yield
    await close_mongo_connection()
    print("[STOP] Application shut down.")


# ──────────────────────────────────────────────
# FastAPI application instance
# ──────────────────────────────────────────────

app = FastAPI(
    title="AI Gym & Fitness Assistant API",
    description=(
        "A comprehensive fitness backend providing BMI calculation, AI-powered diet plans, "
        "workout tracking, habit logging, analytics, and an AI fitness chatbot."
    ),
    version="1.0.0",
    lifespan=lifespan,
)


# ──────────────────────────────────────────────
# CORS Middleware — allow all origins during development
# ──────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
# Router registration
# ──────────────────────────────────────────────

app.include_router(dashboard.router)
app.include_router(fitness.router)
app.include_router(diet.router)
app.include_router(chat.router)
app.include_router(habits.router)
