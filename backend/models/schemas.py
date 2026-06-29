"""
Pydantic v2 schemas for the AI Gym & Fitness Assistant.

All request/response models used across the API are defined here to ensure
a single source of truth for data validation and serialization.
"""

from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from pydantic import AliasChoices


# ──────────────────────────────────────────────
# BMI & Calorie Models
# ──────────────────────────────────────────────

class BMIRequest(BaseModel):
    """Request body for BMI calculation endpoint."""
    model_config = ConfigDict(extra='ignore', coerce_numbers_to_str=False)
    age: int = Field(..., ge=1, le=120, description="User's age in years")
    gender: str = Field(..., description="Gender: 'male' or 'female'")
    height_cm: float = Field(..., gt=0, description="Height in centimeters", validation_alias=AliasChoices('height_cm', 'height'))
    weight_kg: float = Field(..., gt=0, description="Weight in kilograms", validation_alias=AliasChoices('weight_kg', 'weight'))
    goal: str = Field(..., description="Fitness goal: 'lose', 'maintain', or 'gain'")


class BMIResponse(BaseModel):
    """Response body with BMI results and calorie recommendation."""
    bmi: float = Field(..., description="Calculated BMI value")
    category: str = Field(..., description="BMI category label")
    daily_calories: int = Field(..., description="Recommended daily calorie intake")
    ideal_weight_range: str = Field(..., description="Ideal weight range for the user's height")


# ──────────────────────────────────────────────
# Diet Plan Models
# ──────────────────────────────────────────────

class Meal(BaseModel):
    """Represents a single meal with nutritional breakdown."""
    name: str = Field(..., description="Meal name, e.g. 'Grilled Chicken Salad'")
    items: list[str] = Field(..., description="List of food items in the meal")
    calories: int = Field(..., ge=0, description="Total calories for the meal")
    protein: str = Field(..., description="Protein content, e.g. '30g'")
    carbs: str = Field(..., description="Carbohydrate content, e.g. '45g'")
    fats: str = Field(..., description="Fat content, e.g. '12g'")


class DietPlanRequest(BaseModel):
    """Request body for AI-generated diet plan."""
    model_config = ConfigDict(extra='ignore', coerce_numbers_to_str=False)
    age: int = Field(..., ge=1, le=120, description="User's age in years")
    gender: str = Field(..., description="Gender: 'male' or 'female'")
    height_cm: float = Field(..., gt=0, description="Height in centimeters", validation_alias=AliasChoices('height_cm', 'height'))
    weight_kg: float = Field(..., gt=0, description="Weight in kilograms", validation_alias=AliasChoices('weight_kg', 'weight'))
    goal: str = Field(..., description="Fitness goal: 'lose', 'maintain', or 'gain'")
    dietary_preference: str = Field(
        default="balanced",
        description="Dietary preference: 'balanced', 'vegetarian', 'vegan', 'keto', 'high-protein'",
        validation_alias=AliasChoices('dietary_preference', 'preference')
    )


class DietPlanResponse(BaseModel):
    """Response body containing a full day's meal plan."""
    meals: dict = Field(..., description="Dict with keys: breakfast, lunch, dinner, snacks")
    grocery_list: list[str] = Field(..., description="Shopping list for the meal plan")
    total_calories: int = Field(..., description="Total daily calories across all meals")
    notes: str = Field(default="", description="Additional dietary notes or tips")


# ──────────────────────────────────────────────
# Chat Models
# ──────────────────────────────────────────────

class ChatRequest(BaseModel):
    """Request body for the fitness AI chat endpoint."""
    message: str = Field(..., min_length=1, description="User's chat message")
    conversation_id: Optional[str] = Field(
        default=None,
        description="Existing conversation ID to continue a thread"
    )


class ChatResponse(BaseModel):
    """Response body from the fitness AI chat."""
    response: str = Field(..., description="AI-generated reply")
    conversation_id: str = Field(..., description="Conversation ID for continuity")


# ──────────────────────────────────────────────
# Workout & Fitness Models
# ──────────────────────────────────────────────

class WorkoutRecord(BaseModel):
    """A single workout log entry."""
    exercise: str = Field(..., description="Name of the exercise performed")
    reps: int = Field(..., ge=0, description="Number of repetitions")
    duration_seconds: int = Field(..., ge=0, description="Duration in seconds")
    form_score: float = Field(..., ge=0, le=100, description="AI-rated form score (0-100)")
    date: Optional[str] = Field(default=None, description="ISO date string, defaults to today")
    notes: str = Field(default="", description="Optional notes about the workout")


# ──────────────────────────────────────────────
# Habit Tracking Models
# ──────────────────────────────────────────────

class HabitEntry(BaseModel):
    """Daily habit tracking entry."""
    date: str = Field(..., description="ISO date string for the entry")
    water_glasses: int = Field(default=0, ge=0, description="Glasses of water consumed")
    sleep_hours: float = Field(default=0, ge=0, le=24, description="Hours of sleep")
    workout_done: bool = Field(default=False, description="Whether a workout was completed")
    steps: int = Field(default=0, ge=0, description="Step count for the day")
    mood: str = Field(default="good", description="Mood: 'great', 'good', 'okay', 'bad'")
    notes: str = Field(default="", description="Optional notes about the day")
    # Additional fields from frontend
    habits: Optional[dict] = Field(default=None, description="Dict of completed habit IDs")
    water_intake: Optional[int] = Field(default=None, ge=0, description="Alias for water_glasses from frontend")
    score: Optional[int] = Field(default=None, description="Consistency score from frontend")


# ──────────────────────────────────────────────
# Dashboard Models
# ──────────────────────────────────────────────

class WeeklyDataPoint(BaseModel):
    """A single day's data point used in weekly charts."""
    day: str
    workouts: int = 0
    calories: int = 0
    steps: int = 0


class RecentWorkout(BaseModel):
    """Summary of a recent workout for dashboard display."""
    exercise: str
    duration: str
    calories: int
    date: str
    form_score: float


class DashboardData(BaseModel):
    """Comprehensive dashboard response containing all widget data."""
    fitness_score: int = Field(..., description="Overall fitness score 0-100")
    calories_consumed: int = Field(..., description="Today's calories consumed")
    workout_streak: int = Field(..., description="Consecutive workout days")
    active_minutes: int = Field(..., description="Active minutes today")
    weekly_data: list[WeeklyDataPoint] = Field(..., description="7-day chart data")
    recent_workouts: list[RecentWorkout] = Field(..., description="Recent workout list")
    motivation_quote: str = Field(..., description="AI-generated motivational quote")
    chart_insights: Optional[str] = Field(default=None, description="AI-generated insights explaining the weekly charts")
    goals_progress: dict = Field(
        default_factory=dict,
        description="Progress toward user goals"
    )
