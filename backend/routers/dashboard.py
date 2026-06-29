"""
Dashboard router for the AI Gym & Fitness Assistant.

Provides the root application info endpoint and a comprehensive
dashboard data endpoint with fitness metrics, weekly charts, and
motivational quotes.
"""

from datetime import datetime, timedelta
from fastapi import APIRouter
from models.schemas import DashboardData, WeeklyDataPoint, RecentWorkout
from services.openai_service import generate_motivation, generate_chart_insights
from database.connection import get_database

router = APIRouter(tags=["Dashboard"])


@router.get("/", summary="Application root")
async def root():
    """Return basic application information.

    This serves as a health-check and discovery endpoint.
    """
    return {
        "app": "AI Gym & Fitness Assistant",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "dashboard": "/dashboard",
            "calculate_bmi": "/calculate-bmi",
            "generate_diet_plan": "/generate-diet-plan",
            "chat": "/chat",
            "save_workout": "/save-workout",
            "workout_history": "/workout-history",
            "analytics": "/analytics",
            "save_habit": "/save-habit",
            "habits": "/habits",
        },
    }


@router.get("/dashboard", response_model=DashboardData, summary="Get dashboard data")
async def get_dashboard():
    """Return comprehensive dashboard data for the frontend.

    Queries MongoDB for real workout and habit data.
    Falls back to mock data when the database is unavailable.
    """
    try:
        quote = await generate_motivation()
    except Exception:
        quote = "Push yourself, because no one else is going to do it for you! \ud83d\udcaa"

    db = get_database()

    # --- Try to compute real stats from MySQL ---
    if db is not None:
        try:
            now = datetime.now()
            seven_days_ago = (now - timedelta(days=7)).strftime("%Y-%m-%d")

            # Fetch recent workouts from DB
            all_workouts = await db.get_workouts(limit=20)

            # Fetch recent habits from DB
            recent_habits = await db.get_habits(limit=7)

            if all_workouts:
                # Calculate real stats
                total_active_minutes = sum(
                    w.get("duration_seconds", 0) for w in all_workouts
                ) // 60

                # Workout streak: count consecutive days with workouts
                workout_dates = sorted(set(
                    w.get("date", "") for w in all_workouts if w.get("date")
                ), reverse=True)
                streak = 0
                check_date = now.date()
                for _ in range(len(workout_dates) + 1):
                    if check_date.strftime("%Y-%m-%d") in workout_dates:
                        streak += 1
                        check_date -= timedelta(days=1)
                    else:
                        break

                # Average form score as fitness score
                form_scores = [w.get("form_score", 0) for w in all_workouts if w.get("form_score")]
                fitness_score = int(sum(form_scores) / len(form_scores)) if form_scores else 75

                # Build weekly data from workouts in last 7 days
                day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                weekly_data = []
                for i in range(6, -1, -1):
                    d = now - timedelta(days=i)
                    day_label = day_names[d.weekday()]
                    day_str = d.strftime("%Y-%m-%d")
                    day_workouts = [w for w in all_workouts if w.get("date") == day_str]
                    day_calories = sum(w.get("duration_seconds", 0) * 8 // 60 for w in day_workouts)  # rough estimate
                    weekly_data.append(WeeklyDataPoint(
                        day=day_label,
                        workouts=len(day_workouts),
                        calories=day_calories if day_calories else 0,
                        steps=0,
                    ))

                # Build recent workouts for display
                recent_workouts = []
                for w in all_workouts[:5]:
                    dur_sec = w.get("duration_seconds", 0)
                    dur_min = dur_sec // 60
                    recent_workouts.append(RecentWorkout(
                        exercise=w.get("exercise", "Unknown"),
                        duration=f"{dur_min} min",
                        calories=dur_sec * 8 // 60,  # rough calorie estimate
                        date=w.get("date", ""),
                        form_score=w.get("form_score", 0),
                    ))

                chart_insights = await generate_chart_insights(weekly_data)

                return DashboardData(
                    fitness_score=min(fitness_score, 100),
                    calories_consumed=1850,
                    workout_streak=streak,
                    active_minutes=total_active_minutes,
                    weekly_data=weekly_data,
                    recent_workouts=recent_workouts,
                    motivation_quote=quote,
                    chart_insights=chart_insights,
                    goals_progress={
                        "weight_loss": {"target": "75 kg", "current": "78.5 kg", "progress": 65},
                        "strength": {"target": "100 kg bench", "current": "85 kg", "progress": 85},
                        "cardio": {"target": "5K in 25 min", "current": "5K in 28 min", "progress": 70},
                    },
                )
        except Exception as e:
            print(f"[WARN] Error computing real dashboard data: {e}")

    # --- Fallback: mock data ---
    weekly_data = [
        WeeklyDataPoint(day="Mon", workouts=1, calories=2100, steps=8500),
        WeeklyDataPoint(day="Tue", workouts=1, calories=1950, steps=10200),
        WeeklyDataPoint(day="Wed", workouts=0, calories=2200, steps=6800),
        WeeklyDataPoint(day="Thu", workouts=1, calories=2050, steps=9100),
        WeeklyDataPoint(day="Fri", workouts=1, calories=1900, steps=11500),
        WeeklyDataPoint(day="Sat", workouts=1, calories=2300, steps=12300),
        WeeklyDataPoint(day="Sun", workouts=0, calories=2100, steps=7200),
    ]

    recent_workouts = [
        RecentWorkout(exercise="Bench Press", duration="45 min", calories=320, date="2026-06-18", form_score=87.5),
        RecentWorkout(exercise="Squats", duration="40 min", calories=380, date="2026-06-17", form_score=91.0),
        RecentWorkout(exercise="Deadlift", duration="35 min", calories=350, date="2026-06-16", form_score=85.0),
        RecentWorkout(exercise="HIIT Cardio", duration="25 min", calories=290, date="2026-06-15", form_score=88.5),
        RecentWorkout(exercise="Pull-ups & Rows", duration="40 min", calories=310, date="2026-06-14", form_score=82.0),
    ]

    chart_insights = await generate_chart_insights(weekly_data)

    return DashboardData(
        fitness_score=78,
        calories_consumed=1850,
        workout_streak=12,
        active_minutes=45,
        weekly_data=weekly_data,
        recent_workouts=recent_workouts,
        motivation_quote=quote,
        chart_insights=chart_insights,
        goals_progress={
            "weight_loss": {"target": "75 kg", "current": "78.5 kg", "progress": 65},
            "strength": {"target": "100 kg bench", "current": "85 kg", "progress": 85},
            "cardio": {"target": "5K in 25 min", "current": "5K in 28 min", "progress": 70},
        },
    )
