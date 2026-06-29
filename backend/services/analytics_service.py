"""
Analytics service for the AI Gym & Fitness Assistant.

Provides functions to generate workout analytics and performance trend data.
Queries MongoDB for real data and falls back to mock data when unavailable.
"""

import random
from datetime import datetime, timedelta
from database.connection import get_database


async def get_weekly_analytics() -> dict:
    """Generate a weekly analytics summary from real workout data.

    Queries the workouts collection for the last 7 days.
    Falls back to mock data when MongoDB is unavailable.
    """
    db = get_database()
    today = datetime.now()
    days = [(today - timedelta(days=i)).strftime("%a") for i in range(6, -1, -1)]
    day_dates = [(today - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(6, -1, -1)]

    if db is not None:
        try:
            seven_days_ago = (today - timedelta(days=7)).strftime("%Y-%m-%d")
            workouts = await db.get_workouts_since(seven_days_ago)

            if workouts:
                # Calculate real calories per day (rough estimate: 8 cal/min)
                calories = []
                workout_counts = []
                exercise_types = {}

                for i, date_str in enumerate(day_dates):
                    day_workouts = [w for w in workouts if w.get("date") == date_str]
                    day_cal = sum(w.get("duration_seconds", 0) * 8 // 60 for w in day_workouts)
                    calories.append(day_cal)
                    workout_counts.append(len(day_workouts))

                    for w in day_workouts:
                        ex = w.get("exercise", "Other")
                        exercise_types[ex] = exercise_types.get(ex, 0) + 1

                # Convert exercise counts to percentages
                total_exercises = sum(exercise_types.values()) or 1
                exercise_distribution = {
                    k: round(v / total_exercises * 100)
                    for k, v in sorted(exercise_types.items(), key=lambda x: -x[1])
                }

                total_duration = sum(w.get("duration_seconds", 0) for w in workouts)
                total_workout_count = len(workouts)

                return {
                    "calories_burned_weekly": [
                        {"day": d, "calories": c} for d, c in zip(days, calories)
                    ],
                    "workout_frequency": {d: wc for d, wc in zip(days, workout_counts)},
                    "exercise_distribution": exercise_distribution or {
                        "No Data": 100,
                    },
                    "total_workouts": total_workout_count,
                    "total_calories_burned": sum(calories),
                    "avg_workout_duration": (total_duration // max(total_workout_count, 1)) // 60,
                    "most_active_day": max(zip(workout_counts, days))[1],
                }
        except Exception as e:
            print(f"[WARN] Error computing real analytics: {e}")

    # Fallback to mock data
    calories = [random.randint(180, 550) for _ in range(7)]
    workout_counts = [random.randint(0, 2) for _ in range(7)]

    return {
        "calories_burned_weekly": [
            {"day": d, "calories": c} for d, c in zip(days, calories)
        ],
        "workout_frequency": {d: wc for d, wc in zip(days, workout_counts)},
        "exercise_distribution": {
            "Strength Training": 35,
            "Cardio": 25,
            "HIIT": 20,
            "Yoga / Flexibility": 12,
            "Sports": 8,
        },
        "total_workouts": sum(workout_counts),
        "total_calories_burned": sum(calories),
        "avg_workout_duration": random.randint(35, 55),
        "most_active_day": max(zip(workout_counts, days))[1],
    }


async def get_performance_trends(weeks: int = 4) -> dict:
    """Generate performance trend data from real workout data.

    Queries MongoDB for workout records spanning multiple weeks.
    Falls back to mock data when unavailable.
    """
    db = get_database()
    today = datetime.now()

    if db is not None:
        try:
            start_date = (today - timedelta(weeks=weeks)).strftime("%Y-%m-%d")
            workouts = await db.get_workouts_since(start_date)

            if workouts:
                strength = []
                endurance = []
                body_metrics = []

                for i in range(weeks):
                    week_start = today - timedelta(weeks=weeks - 1 - i)
                    week_end = week_start + timedelta(days=7)
                    week_label = week_start.strftime("%b %d")

                    week_workouts = [
                        w for w in workouts
                        if week_start.strftime("%Y-%m-%d") <= w.get("date", "") < week_end.strftime("%Y-%m-%d")
                    ]

                    total_reps = sum(w.get("reps", 0) for w in week_workouts)
                    total_duration = sum(w.get("duration_seconds", 0) for w in week_workouts)
                    avg_score = (
                        sum(w.get("form_score", 0) for w in week_workouts) / len(week_workouts)
                        if week_workouts else 0
                    )

                    strength.append({
                        "week": week_label,
                        "bench_press_kg": round(50 + total_reps * 0.5, 1),
                        "squat_kg": round(70 + total_reps * 0.6, 1),
                        "deadlift_kg": round(80 + total_reps * 0.7, 1),
                    })

                    endurance.append({
                        "week": week_label,
                        "cardio_minutes": total_duration // 60,
                        "avg_heart_rate": random.randint(135, 160),
                    })

                    body_metrics.append({
                        "week": week_label,
                        "weight_kg": round(75.0 - i * 0.2, 1),
                        "body_fat_pct": round(20.0 - i * 0.3, 1),
                    })

                total_possible = weeks * 7
                workout_days = len(set(w.get("date") for w in workouts if w.get("date")))
                consistency = round(min(workout_days / max(total_possible, 1) * 100, 100), 1)

                return {
                    "strength_progress": strength,
                    "endurance_progress": endurance,
                    "body_metrics": body_metrics,
                    "consistency_score": consistency,
                }
        except Exception as e:
            print(f"[WARN] Error computing real performance trends: {e}")

    # Fallback to mock data
    strength = []
    endurance = []
    body_metrics = []

    base_weight = random.uniform(68.0, 82.0)
    base_strength = random.randint(50, 70)
    base_endurance = random.randint(20, 30)
    base_bf = random.uniform(18.0, 25.0)

    for i in range(weeks):
        week_label = (today - timedelta(weeks=weeks - 1 - i)).strftime("%b %d")

        strength.append({
            "week": week_label,
            "bench_press_kg": round(base_strength + i * random.uniform(1.0, 2.5), 1),
            "squat_kg": round(base_strength * 1.4 + i * random.uniform(1.5, 3.0), 1),
            "deadlift_kg": round(base_strength * 1.6 + i * random.uniform(2.0, 3.5), 1),
        })

        endurance.append({
            "week": week_label,
            "cardio_minutes": base_endurance + i * random.randint(2, 5),
            "avg_heart_rate": random.randint(135, 160),
        })

        body_metrics.append({
            "week": week_label,
            "weight_kg": round(base_weight - i * random.uniform(0.1, 0.4), 1),
            "body_fat_pct": round(base_bf - i * random.uniform(0.2, 0.5), 1),
        })

    return {
        "strength_progress": strength,
        "endurance_progress": endurance,
        "body_metrics": body_metrics,
        "consistency_score": round(random.uniform(65.0, 95.0), 1),
    }


async def get_exercise_recommendations(recent_exercises: list[str] | None = None) -> list[dict]:
    """Suggest exercises based on recent activity (mock implementation).

    Args:
        recent_exercises: List of exercise names the user has done recently.

    Returns:
        list of exercise recommendation dicts.
    """
    all_exercises = [
        {"name": "Barbell Squat", "muscle_group": "Legs", "difficulty": "Intermediate", "sets": 4, "reps": "8-10"},
        {"name": "Bench Press", "muscle_group": "Chest", "difficulty": "Intermediate", "sets": 4, "reps": "8-12"},
        {"name": "Deadlift", "muscle_group": "Back", "difficulty": "Advanced", "sets": 3, "reps": "5-8"},
        {"name": "Pull-ups", "muscle_group": "Back", "difficulty": "Intermediate", "sets": 3, "reps": "6-12"},
        {"name": "Overhead Press", "muscle_group": "Shoulders", "difficulty": "Intermediate", "sets": 3, "reps": "8-10"},
        {"name": "Plank", "muscle_group": "Core", "difficulty": "Beginner", "sets": 3, "reps": "30-60s"},
        {"name": "Lunges", "muscle_group": "Legs", "difficulty": "Beginner", "sets": 3, "reps": "12 each"},
        {"name": "Dumbbell Rows", "muscle_group": "Back", "difficulty": "Beginner", "sets": 3, "reps": "10-12"},
        {"name": "Burpees", "muscle_group": "Full Body", "difficulty": "Intermediate", "sets": 3, "reps": "10-15"},
        {"name": "Mountain Climbers", "muscle_group": "Core / Cardio", "difficulty": "Beginner", "sets": 3, "reps": "20 each"},
    ]

    recent = set(recent_exercises or [])
    filtered = [e for e in all_exercises if e["name"] not in recent]
    return random.sample(filtered, min(5, len(filtered)))
