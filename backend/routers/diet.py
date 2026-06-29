"""
Diet router for the AI Gym & Fitness Assistant.

Provides BMI calculation and AI-powered diet plan generation endpoints.
BMI uses the standard formula with Harris-Benedict equation for calorie estimation.
"""

import math
from fastapi import APIRouter, HTTPException, status
from models.schemas import BMIRequest, BMIResponse, DietPlanRequest, DietPlanResponse
from services.openai_service import generate_meal_plan

router = APIRouter(tags=["Diet & Nutrition"])


@router.post("/calculate-bmi", response_model=BMIResponse, summary="Calculate BMI")
async def calculate_bmi(request: BMIRequest):
    """Calculate BMI and recommend daily calorie intake.

    **BMI Formula**: weight_kg / (height_cm / 100)²

    **Categories**:
    - Underweight: BMI < 18.5
    - Normal weight: 18.5 ≤ BMI < 25.0
    - Overweight: 25.0 ≤ BMI < 30.0
    - Obese: BMI ≥ 30.0

    **Calorie Estimation**: Uses the Harris-Benedict equation (revised)
    to compute Basal Metabolic Rate (BMR) and adjusts by an activity
    multiplier and goal modifier.

    Args:
        request: BMIRequest with user stats and fitness goal.

    Returns:
        BMIResponse with BMI value, category, calorie target, and ideal weight range.
    """
    try:
        # ── BMI Calculation ──
        height_m = request.height_cm / 100
        bmi = round(request.weight_kg / (height_m ** 2), 1)

        # ── Category ──
        if bmi < 18.5:
            category = "Underweight"
        elif bmi < 25.0:
            category = "Normal weight"
        elif bmi < 30.0:
            category = "Overweight"
        else:
            category = "Obese"

        # ── Harris-Benedict BMR ──
        if request.gender.lower() in ("male", "m"):
            bmr = 88.362 + (13.397 * request.weight_kg) + (4.799 * request.height_cm) - (5.677 * request.age)
        else:
            bmr = 447.593 + (9.247 * request.weight_kg) + (3.098 * request.height_cm) - (4.330 * request.age)

        # Moderate activity multiplier
        tdee = bmr * 1.55

        # Goal adjustment
        goal = request.goal.lower()
        if goal in ("lose", "cut", "fat loss"):
            daily_calories = int(tdee - 400)
        elif goal in ("gain", "bulk", "muscle gain"):
            daily_calories = int(tdee + 350)
        else:
            daily_calories = int(tdee)

        # ── Ideal Weight Range (BMI 18.5–24.9) ──
        ideal_low = round(18.5 * (height_m ** 2), 1)
        ideal_high = round(24.9 * (height_m ** 2), 1)
        ideal_weight_range = f"{ideal_low} kg – {ideal_high} kg"

        return BMIResponse(
            bmi=bmi,
            category=category,
            daily_calories=daily_calories,
            ideal_weight_range=ideal_weight_range,
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error calculating BMI: {str(e)}",
        )


@router.post("/generate-diet-plan", response_model=DietPlanResponse, summary="Generate AI diet plan")
async def generate_diet_plan(request: DietPlanRequest):
    """Generate a personalised daily meal plan using AI.

    Calls the OpenAI service to produce a structured meal plan tailored
    to the user's stats and dietary preference. Falls back to a curated
    mock meal plan when the API key is unavailable.

    Args:
        request: DietPlanRequest with user stats, goal, and dietary preference.

    Returns:
        DietPlanResponse with meals, grocery list, total calories, and notes.
    """
    try:
        plan = await generate_meal_plan(
            age=request.age,
            gender=request.gender,
            height_cm=request.height_cm,
            weight_kg=request.weight_kg,
            goal=request.goal,
            dietary_preference=request.dietary_preference,
        )

        return DietPlanResponse(
            meals=plan.get("meals", {}),
            grocery_list=plan.get("grocery_list", []),
            total_calories=plan.get("total_calories", 2000),
            notes=plan.get("notes", ""),
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating diet plan: {str(e)}",
        )
