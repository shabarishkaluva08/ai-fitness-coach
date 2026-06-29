"""
Gemini service for the AI Gym & Fitness Assistant.

Provides async wrappers around Google Gemini's generation API for:
  - Generating personalised meal plans
  - Powering the fitness chat assistant
  - Creating motivational quotes

Every function gracefully falls back to well-structured mock responses
when the GEMINI_API_KEY environment variable is not set or an API call fails.
"""

import os
import json
import random
from uuid import uuid4
from google import genai
from dotenv import load_dotenv

load_dotenv()

# ──────────────────────────────────────────────
# Client initialisation
# ──────────────────────────────────────────────

_api_key = os.getenv("GEMINI_API_KEY", "")
_client = None
_client_ready = False

if _api_key and _api_key != "your-gemini-api-key-here":
    try:
        _client = genai.Client(api_key=_api_key)
        _client_ready = True
        print("[OK] Google Gemini client initialised (google-genai SDK).")
    except Exception as e:
        print(f"[WARN] Failed to configure Gemini client: {e}")
else:
    print("[WARN] GEMINI_API_KEY not set -- AI endpoints will return mock responses.")


def _is_available() -> bool:
    """Check whether the Gemini client is ready to use."""
    return _client_ready and _client is not None


# ──────────────────────────────────────────────
# Meal Plan Generation
# ──────────────────────────────────────────────

async def generate_meal_plan(
    age: int,
    gender: str,
    height_cm: float,
    weight_kg: float,
    goal: str,
    dietary_preference: str = "balanced",
) -> dict:
    """Generate a full-day meal plan using Gemini or mock data.

    Args:
        age: User's age in years.
        gender: 'male' or 'female'.
        height_cm: Height in centimeters.
        weight_kg: Weight in kilograms.
        goal: Fitness goal — 'lose', 'maintain', or 'gain'.
        dietary_preference: One of 'balanced', 'vegetarian', 'vegan', 'keto', 'high-protein'.

    Returns:
        dict matching the DietPlanResponse schema.
    """
    if _is_available():
        try:
            prompt = (
                f"Create a detailed daily meal plan for a {age}-year-old {gender}, "
                f"{height_cm}cm tall, {weight_kg}kg, goal: {goal}, "
                f"dietary preference: {dietary_preference}. "
                "Return JSON with keys: meals (object with breakfast, lunch, dinner, snacks — "
                "each having name, items[], calories, protein, carbs, fats), "
                "grocery_list[], total_calories, notes. "
                "Be specific with portion sizes. Return ONLY valid JSON without markdown fences."
            )
            response = await _client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={"response_mime_type": "application/json"},
            )
            content = response.text.strip()
            return json.loads(content)
        except Exception as e:
            print(f"[WARN] Gemini meal plan error, using mock: {e}")

    return _mock_meal_plan(goal, dietary_preference)


def _mock_meal_plan(goal: str, preference: str) -> dict:
    """Return a realistic mock meal plan based on goal and preference."""
    calorie_targets = {"lose": 1800, "maintain": 2200, "gain": 2800}
    target = calorie_targets.get(goal, 2200)

    if preference == "vegetarian":
        return {
            "meals": {
                "breakfast": {
                    "name": "Greek Yogurt Parfait",
                    "items": ["Greek yogurt (200g)", "Mixed berries (100g)", "Granola (40g)", "Honey (1 tbsp)", "Chia seeds (1 tbsp)"],
                    "calories": 420,
                    "protein": "22g",
                    "carbs": "55g",
                    "fats": "14g",
                },
                "lunch": {
                    "name": "Mediterranean Quinoa Bowl",
                    "items": ["Quinoa (1 cup cooked)", "Chickpeas (½ cup)", "Cherry tomatoes", "Cucumber", "Feta cheese (30g)", "Olive oil dressing"],
                    "calories": 580,
                    "protein": "24g",
                    "carbs": "72g",
                    "fats": "18g",
                },
                "dinner": {
                    "name": "Paneer Tikka with Brown Rice",
                    "items": ["Paneer tikka (150g)", "Brown rice (1 cup cooked)", "Mixed vegetable curry", "Raita (small bowl)"],
                    "calories": 620,
                    "protein": "30g",
                    "carbs": "65g",
                    "fats": "22g",
                },
                "snacks": {
                    "name": "Trail Mix & Fruit",
                    "items": ["Almonds (20g)", "Walnuts (15g)", "Apple (1 medium)", "Protein bar (1)"],
                    "calories": 380,
                    "protein": "14g",
                    "carbs": "42g",
                    "fats": "18g",
                },
            },
            "grocery_list": [
                "Greek yogurt", "Mixed berries", "Granola", "Honey", "Chia seeds",
                "Quinoa", "Chickpeas (canned)", "Cherry tomatoes", "Cucumber",
                "Feta cheese", "Olive oil", "Paneer", "Brown rice", "Mixed vegetables",
                "Yogurt for raita", "Almonds", "Walnuts", "Apples", "Protein bars",
            ],
            "total_calories": 2000,
            "notes": f"This vegetarian plan targets ~{target} kcal/day. Adjust portion sizes to match your exact calorie goal. Drink at least 8 glasses of water daily.",
        }

    if preference == "keto":
        return {
            "meals": {
                "breakfast": {
                    "name": "Keto Egg Scramble",
                    "items": ["Eggs (3 large)", "Avocado (½)", "Cheddar cheese (30g)", "Spinach (1 cup)", "Butter (1 tbsp)"],
                    "calories": 520,
                    "protein": "28g",
                    "carbs": "6g",
                    "fats": "44g",
                },
                "lunch": {
                    "name": "Grilled Salmon with Avocado Salad",
                    "items": ["Salmon fillet (180g)", "Avocado (½)", "Mixed greens", "Olive oil (2 tbsp)", "Lemon juice"],
                    "calories": 620,
                    "protein": "40g",
                    "carbs": "8g",
                    "fats": "48g",
                },
                "dinner": {
                    "name": "Steak with Roasted Vegetables",
                    "items": ["Ribeye steak (200g)", "Broccoli (1 cup)", "Asparagus (6 spears)", "Butter (1 tbsp)", "Garlic"],
                    "calories": 650,
                    "protein": "50g",
                    "carbs": "10g",
                    "fats": "46g",
                },
                "snacks": {
                    "name": "Keto Snack Plate",
                    "items": ["Macadamia nuts (30g)", "String cheese (2)", "Cucumber slices with cream cheese"],
                    "calories": 410,
                    "protein": "16g",
                    "carbs": "5g",
                    "fats": "38g",
                },
            },
            "grocery_list": [
                "Eggs", "Avocados", "Cheddar cheese", "Spinach", "Butter",
                "Salmon fillets", "Mixed greens", "Olive oil", "Lemons",
                "Ribeye steak", "Broccoli", "Asparagus", "Garlic",
                "Macadamia nuts", "String cheese", "Cream cheese", "Cucumbers",
            ],
            "total_calories": 2200,
            "notes": f"This keto plan keeps net carbs under 30g/day. Target: ~{target} kcal. Stay hydrated and supplement electrolytes.",
        }

    # Default: balanced / high-protein
    return {
        "meals": {
            "breakfast": {
                "name": "Protein Oatmeal Bowl",
                "items": ["Rolled oats (60g)", "Whey protein (1 scoop)", "Banana (1 medium)", "Almond butter (1 tbsp)", "Milk (200ml)"],
                "calories": 480,
                "protein": "35g",
                "carbs": "58g",
                "fats": "12g",
            },
            "lunch": {
                "name": "Grilled Chicken & Rice Bowl",
                "items": ["Grilled chicken breast (180g)", "Brown rice (1 cup cooked)", "Steamed broccoli (1 cup)", "Sweet potato (100g)", "Olive oil drizzle"],
                "calories": 620,
                "protein": "48g",
                "carbs": "65g",
                "fats": "14g",
            },
            "dinner": {
                "name": "Baked Salmon with Vegetables",
                "items": ["Salmon fillet (180g)", "Quinoa (¾ cup cooked)", "Roasted asparagus", "Mixed green salad", "Lemon-herb dressing"],
                "calories": 580,
                "protein": "42g",
                "carbs": "40g",
                "fats": "22g",
            },
            "snacks": {
                "name": "Healthy Snack Combo",
                "items": ["Greek yogurt (150g)", "Mixed nuts (30g)", "Protein shake (1 scoop)", "Orange (1 medium)"],
                "calories": 420,
                "protein": "32g",
                "carbs": "38g",
                "fats": "15g",
            },
        },
        "grocery_list": [
            "Rolled oats", "Whey protein powder", "Bananas", "Almond butter", "Milk",
            "Chicken breast", "Brown rice", "Broccoli", "Sweet potatoes", "Olive oil",
            "Salmon fillets", "Quinoa", "Asparagus", "Mixed salad greens", "Lemons",
            "Greek yogurt", "Mixed nuts", "Oranges",
        ],
        "total_calories": 2100,
        "notes": f"This balanced plan targets ~{target} kcal/day with a macro split of 35% protein, 40% carbs, 25% fats. Adjust portions as needed.",
    }


# ──────────────────────────────────────────────
# Fitness Chat
# ──────────────────────────────────────────────

async def chat_response(message: str, conversation_id: str | None = None) -> dict:
    """Generate a fitness-focused AI chat response.

    Args:
        message: The user's chat message.
        conversation_id: Optional conversation ID for thread continuity.

    Returns:
        dict with 'response' and 'conversation_id' keys.
    """
    convo_id = conversation_id or str(uuid4())

    if _is_available():
        try:
            system_instruction = (
                "You are FitBot, a knowledgeable and encouraging AI fitness assistant. "
                "You provide evidence-based advice on workouts, nutrition, recovery, and "
                "general wellness. Keep responses concise (2-4 sentences) unless the user "
                "asks for detail. Always prioritise safety."
            )
            full_prompt = f"System: {system_instruction}\n\nUser: {message}"
            response = await _client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=full_prompt,
            )
            return {
                "response": response.text.strip(),
                "conversation_id": convo_id,
            }
        except Exception as e:
            print(f"[WARN] Gemini chat error, using mock: {e}")

    return {
        "response": _mock_chat_response(message),
        "conversation_id": convo_id,
    }


def _mock_chat_response(message: str) -> str:
    """Return an intelligent mock response based on keyword matching."""
    msg = message.lower()

    if any(w in msg for w in ["lose weight", "fat loss", "slim", "cut"]):
        return (
            "For effective fat loss, aim for a moderate calorie deficit of 300–500 kcal/day "
            "combined with strength training 3–4 times per week and 150 minutes of cardio. "
            "Prioritise protein intake (1.6–2.2 g/kg body weight) to preserve muscle mass. "
            "Stay consistent — sustainable habits beat extreme diets every time! 💪"
        )

    if any(w in msg for w in ["muscle", "bulk", "gain", "mass", "hypertrophy"]):
        return (
            "To build muscle, focus on progressive overload — gradually increasing weight, reps, "
            "or sets over time. Eat in a slight calorie surplus (200–400 kcal above maintenance) "
            "with 1.8–2.2 g protein per kg body weight. Compound exercises like squats, deadlifts, "
            "and bench press should form the core of your program. Rest 48 hours between training "
            "the same muscle group. 🏋️"
        )

    if any(w in msg for w in ["protein", "nutrition", "diet", "eat", "food", "meal"]):
        return (
            "Great question about nutrition! A balanced diet should include lean proteins "
            "(chicken, fish, tofu), complex carbs (oats, brown rice, sweet potatoes), healthy fats "
            "(avocado, nuts, olive oil), and plenty of vegetables. Aim for 1.6–2.0 g protein per kg "
            "of body weight if you're active. Meal timing matters less than total daily intake. 🥗"
        )

    if any(w in msg for w in ["stretch", "flexibility", "warm", "cool", "recovery", "rest", "sleep"]):
        return (
            "Recovery is just as important as training! Aim for 7–9 hours of quality sleep, "
            "incorporate dynamic stretching before workouts and static stretching after. "
            "Consider foam rolling for myofascial release and take at least 1–2 full rest days "
            "per week. Adequate hydration and nutrition also play a huge role in recovery. 😴"
        )

    if any(w in msg for w in ["cardio", "run", "jog", "hiit", "endurance"]):
        return (
            "Cardio is fantastic for heart health and endurance! Mix steady-state cardio "
            "(30–45 min at moderate intensity) with HIIT sessions (20–25 min) for optimal results. "
            "If fat loss is your goal, HIIT can be more time-efficient. Always warm up for 5 minutes "
            "and cool down properly. Aim for 150–300 minutes of moderate activity per week. 🏃"
        )

    if any(w in msg for w in ["beginner", "start", "new", "first time"]):
        return (
            "Welcome to your fitness journey! 🎉 Start with 3 full-body workouts per week, "
            "focusing on bodyweight exercises: push-ups, squats, lunges, and planks. "
            "Gradually add resistance as you build strength. Don't forget to stay hydrated, "
            "get enough sleep, and be patient — results take 4–8 weeks to become visible. "
            "Consistency is the key to long-term success!"
        )

    if any(w in msg for w in ["motivation", "inspire", "discipline", "habit"]):
        return (
            "Remember: motivation gets you started, but discipline keeps you going. 🔥 "
            "Set small, achievable goals and celebrate each milestone. Track your workouts "
            "to see how far you've come. Surround yourself with supportive people, and on "
            "tough days, just show up — even a 15-minute workout counts. You've got this!"
        )

    # Default response
    return (
        "Thanks for your question! As your AI fitness assistant, I can help with workout plans, "
        "nutrition advice, recovery strategies, and staying motivated. "
        "Feel free to ask about specific exercises, diet plans, or any fitness topic — "
        "I'm here to help you reach your goals! 💪🏋️"
    )


# ──────────────────────────────────────────────
# Motivational Quotes
# ──────────────────────────────────────────────

_MOTIVATION_QUOTES = [
    "The only bad workout is the one that didn't happen. Keep showing up! 💪",
    "Your body can stand almost anything. It's your mind you have to convince. 🧠",
    "Fitness is not about being better than someone else. It's about being better than you used to be. 🌟",
    "The pain you feel today will be the strength you feel tomorrow. 🔥",
    "Don't wish for a good body, work for it. Every rep counts! 🏋️",
    "Sweat is just fat crying. Keep pushing! 💧",
    "Success isn't given. It's earned — in the gym, on the track, in the kitchen. 🏆",
    "You don't have to be extreme, just consistent. That's the real secret. ✨",
    "The difference between wanting and achieving is discipline. 🎯",
    "Take care of your body. It's the only place you have to live. 🏠",
    "Strong is the new beautiful. Embrace the grind! 💎",
    "Champions keep playing until they get it right. 🥇",
]


async def generate_motivation() -> str:
    """Generate a motivational fitness quote using Gemini or a curated fallback.

    Returns:
        A motivational quote string.
    """
    if _is_available():
        try:
            response = await _client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents="Generate a short, powerful motivational fitness quote (1-2 sentences). Include an emoji.",
            )
            return response.text.strip()
        except Exception as e:
            print(f"[WARN] Gemini motivation error, using mock: {e}")

    return random.choice(_MOTIVATION_QUOTES)


async def generate_chart_insights(weekly_data: list) -> str:
    """Generate AI insights for the weekly workout/calories chart using Gemini."""
    if _is_available():
        try:
            data_summary = ", ".join([
                f"{d.get('day', '')}: {d.get('workouts', 0)} workouts, {d.get('calories', 0)} kcal burned"
                if isinstance(d, dict) else
                f"{d.day}: {d.workouts} workouts, {d.calories} kcal burned"
                for d in weekly_data
            ])
            prompt = (
                f"Analyze this user's weekly workout activity data: {data_summary}. "
                "Write a short, highly professional, encouraging 2-3 sentence summary of their "
                "workout trends, noting which days they were most active, any patterns you see, "
                "and a brief tip to optimize their energy or recovery. Use 1 or 2 appropriate emojis."
            )
            response = await _client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            return response.text.strip()
        except Exception as e:
            print(f"[WARN] Gemini chart insights error, using mock: {e}")

    # Curated fallbacks based on workouts
    total_workouts = sum(d.get('workouts', 0) if isinstance(d, dict) else d.workouts for d in weekly_data)
    if total_workouts >= 4:
        return "Incredible week! You worked out consistently, showing great discipline. Your calorie burn peaked mid-week. Remember to prioritize sleep and hydration to support recovery and muscle growth! 🏋️‍♀️💧"
    elif total_workouts >= 1:
        return "Nice job getting active this week! You've got solid momentum going. Try scheduling workouts on your lighter days to build a consistent habit. Keep taking it step by step! 🏃‍♂️✨"
    else:
        return "Every day is a fresh opportunity to start. Consider scheduling a short 15-minute bodyweight or stretching session tomorrow. Small steps lead to big transformations! 🌟"
