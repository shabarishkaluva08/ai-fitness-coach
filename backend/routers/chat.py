"""
Chat router for the AI Gym & Fitness Assistant.

Provides a conversational AI endpoint powered by OpenAI (or mock fallback)
that responds to fitness, nutrition, and wellness questions.
Chat history is persisted to MongoDB when available.
"""

from datetime import datetime
from fastapi import APIRouter, status
from models.schemas import ChatRequest, ChatResponse
from database.connection import get_database
from services.openai_service import chat_response

router = APIRouter(tags=["Chat"])


@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK, summary="Chat with FitBot")
async def chat(request: ChatRequest):
    """Send a message to the AI fitness assistant and receive a reply.

    The assistant (FitBot) can answer questions about workouts, nutrition,
    recovery, motivation, and general fitness topics. Conversations are
    threaded by conversation_id for continuity.

    Chat exchanges are saved to the MongoDB ``chat_history`` collection
    when the database is available.

    Args:
        request: ChatRequest with the user's message and optional conversation_id.

    Returns:
        ChatResponse with the AI reply and conversation_id.
    """
    # Generate AI response (OpenAI or mock)
    result = await chat_response(
        message=request.message,
        conversation_id=request.conversation_id,
    )

    # Persist to MySQL (best-effort)
    db = get_database()
    if db is not None:
        try:
            chat_record = {
                "conversation_id": result["conversation_id"],
                "user_message": request.message,
                "bot_response": result["response"],
                "timestamp": datetime.utcnow().isoformat(),
            }
            await db.save_chat(chat_record)
        except Exception as e:
            print(f"[WARN] DB error saving chat history: {e}")

    return ChatResponse(
        response=result["response"],
        conversation_id=result["conversation_id"],
    )
