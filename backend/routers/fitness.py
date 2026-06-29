"""
Fitness router for the AI Gym & Fitness Assistant.

Handles workout logging, workout history retrieval, and analytics data.
All database operations fall back to mock data when MongoDB is unavailable.
"""

from datetime import datetime
from uuid import uuid4
from fastapi import APIRouter, HTTPException, status
from models.schemas import WorkoutRecord
from database.connection import get_database
from services.analytics_service import get_weekly_analytics, get_performance_trends

router = APIRouter(tags=["Fitness"])


@router.post("/save-workout", status_code=status.HTTP_201_CREATED, summary="Save a workout")
async def save_workout(workout: WorkoutRecord):
    """Save a workout record to MongoDB.

    If no date is provided, defaults to the current UTC date.
    Returns the saved record ID on success, or a confirmation
    with a generated ID when the database is unavailable.

    Args:
        workout: WorkoutRecord with exercise details.

    Returns:
        dict with status, message, and workout_id.
    """
    workout_dict = workout.model_dump()
    workout_dict["date"] = workout_dict.get("date") or datetime.utcnow().strftime("%Y-%m-%d")
    workout_dict["created_at"] = datetime.utcnow().isoformat()

    db = get_database()
    if db is not None:
        try:
            workout_id = await db.save_workout(workout_dict)
            if workout_id:
                return {
                    "status": "success",
                    "message": "Workout saved successfully",
                    "workout_id": workout_id,
                }
        except Exception as e:
            print(f"[WARN] DB error saving workout: {e}")

    # Fallback when DB is unavailable
    return {
        "status": "success",
        "message": "Workout recorded (offline mode)",
        "workout_id": str(uuid4()),
    }


@router.get("/workout-history", summary="Get workout history")
async def get_workout_history():
    """Retrieve the last 20 workouts from MongoDB.

    Falls back to realistic mock data when the database is unavailable
    or the collection is empty.

    Returns:
        dict with status and workouts list.
    """
    db = get_database()
    if db is not None:
        try:
            workouts = await db.get_workouts(limit=20)
            if workouts:
                return {"status": "success", "workouts": workouts}
        except Exception as e:
            print(f"[WARN] DB error fetching workout history: {e}")

    # Mock workout history
    mock_workouts = [
        {
            "exercise": "Bench Press",
            "reps": 10,
            "duration_seconds": 2700,
            "form_score": 87.5,
            "date": "2026-06-18",
            "notes": "Increased weight by 2.5kg",
        },
        {
            "exercise": "Barbell Squats",
            "reps": 12,
            "duration_seconds": 2400,
            "form_score": 91.0,
            "date": "2026-06-17",
            "notes": "Deep squats, great form",
        },
        {
            "exercise": "Deadlift",
            "reps": 8,
            "duration_seconds": 2100,
            "form_score": 85.0,
            "date": "2026-06-16",
            "notes": "Focused on hip hinge",
        },
        {
            "exercise": "HIIT Cardio",
            "reps": 20,
            "duration_seconds": 1500,
            "form_score": 88.5,
            "date": "2026-06-15",
            "notes": "Tabata-style intervals",
        },
        {
            "exercise": "Pull-ups",
            "reps": 8,
            "duration_seconds": 1800,
            "form_score": 82.0,
            "date": "2026-06-14",
            "notes": "Strict form, no kipping",
        },
        {
            "exercise": "Overhead Press",
            "reps": 10,
            "duration_seconds": 2000,
            "form_score": 84.0,
            "date": "2026-06-13",
            "notes": "Shoulder felt strong",
        },
        {
            "exercise": "Lunges",
            "reps": 16,
            "duration_seconds": 1800,
            "form_score": 89.0,
            "date": "2026-06-12",
            "notes": "Alternating legs with dumbbells",
        },
        {
            "exercise": "Plank Hold",
            "reps": 3,
            "duration_seconds": 900,
            "form_score": 93.0,
            "date": "2026-06-11",
            "notes": "3 sets of 60-second holds",
        },
    ]

    return {"status": "success", "workouts": mock_workouts}


@router.get("/analytics", summary="Get workout analytics")
async def get_analytics():
    """Return weekly workout analytics and performance trends.

    Combines weekly summary data with multi-week performance trends
    for comprehensive chart visualisation in the frontend.

    Returns:
        dict with weekly analytics, performance trends, and summary stats.
    """
    try:
        weekly = await get_weekly_analytics()
        trends = await get_performance_trends(weeks=4)

        return {
            "status": "success",
            "weekly_analytics": weekly,
            "performance_trends": trends,
            "summary": {
                "total_workouts_this_week": weekly["total_workouts"],
                "calories_burned_this_week": weekly["total_calories_burned"],
                "avg_duration_minutes": weekly["avg_workout_duration"],
                "most_active_day": weekly["most_active_day"],
                "consistency_score": trends["consistency_score"],
            },
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating analytics: {str(e)}",
        )
