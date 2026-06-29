"""
Habits router for the AI Gym & Fitness Assistant.

Handles daily habit tracking — water intake, sleep, steps, mood, etc.
Persists to MongoDB and falls back to 7 days of mock data when unavailable.
"""

from datetime import datetime, timedelta
from uuid import uuid4
from fastapi import APIRouter, status
from models.schemas import HabitEntry
from database.connection import get_database

router = APIRouter(tags=["Habits"])


@router.post("/save-habit", status_code=status.HTTP_201_CREATED, summary="Save a daily habit entry")
async def save_habit(habit: HabitEntry):
    """Save a daily habit tracking entry to MongoDB.

    Records water intake, sleep hours, workout completion, steps,
    mood, and optional notes for the given date.
    Normalizes frontend field names to canonical backend format.

    Args:
        habit: HabitEntry with the day's tracking data.

    Returns:
        dict with status, message, and entry ID.
    """
    habit_dict = habit.model_dump()

    # Normalize frontend field names
    if habit_dict.get("water_intake") is not None and habit_dict.get("water_glasses", 0) == 0:
        habit_dict["water_glasses"] = habit_dict["water_intake"]
    if habit_dict.get("habits") and not habit_dict.get("workout_done"):
        habit_dict["workout_done"] = habit_dict["habits"].get("workout", False)

    habit_dict["created_at"] = datetime.utcnow().isoformat()

    db = get_database()
    if db is not None:
        try:
            # Upsert: update if same date exists, insert if not
            result = await db.save_habit(habit_dict)
            if result:
                return {
                    "status": "success",
                    "message": "Habit entry saved successfully",
                    "entry_id": result,
                }
        except Exception as e:
            print(f"[WARN] DB error saving habit: {e}")

    # Offline fallback
    return {
        "status": "success",
        "message": "Habit entry recorded (offline mode)",
        "entry_id": str(uuid4()),
    }


@router.get("/habits", summary="Get habit history")
async def get_habits():
    """Retrieve habit tracking history from MongoDB.

    Returns the most recent 30 entries. Falls back to 7 days
    of realistic mock data when the database is unavailable.

    Returns:
        dict with status and habits list.
    """
    db = get_database()
    if db is not None:
        try:
            habits = await db.get_habits(limit=30)
            if habits:
                return {"status": "success", "habits": habits}
        except Exception as e:
            print(f"[WARN] DB error fetching habits: {e}")

    # Mock 7 days of habit data
    today = datetime.now()
    mock_habits = []
    moods = ["great", "good", "good", "okay", "great", "good", "okay"]
    water = [8, 10, 7, 9, 6, 11, 8]
    sleep = [7.5, 8.0, 6.5, 7.0, 8.5, 7.0, 6.0]
    steps_list = [8500, 10200, 6800, 9100, 11500, 12300, 7200]
    worked_out = [True, True, False, True, True, True, False]

    for i in range(7):
        day = today - timedelta(days=6 - i)
        mock_habits.append({
            "date": day.strftime("%Y-%m-%d"),
            "water_glasses": water[i],
            "sleep_hours": sleep[i],
            "workout_done": worked_out[i],
            "steps": steps_list[i],
            "mood": moods[i],
            "notes": "",
        })

    return {"status": "success", "habits": mock_habits}
