# 🏋️‍♂️ AI Fitness Coach & Gym Companion

A comprehensive, dark-themed personal health dashboard and AI-powered coach. The app leverages **Google Gemini AI** and **MediaPipe Pose Estimation** to deliver real-time workout tracking, personalized nutritional advice, habit tracking, and custom workout analytics.

---

## 🚀 Core Features & Tools

### 1. Unified Fitness Dashboard
The central command center of the application. It aggregates all key metrics, active habits, and recent activities in a clean glassmorphic interface.
* **Dynamic Metric Cards**: Track your Fitness Score, Today's Calories Burned, Active Streak (days), and Active Minutes.
* **Weekly Activity Analytics**: A visual area chart showing energy burned and metrics.
* **Google Gemini AI Insights**: Automatically analyzes your weekly activity data points and generates custom tips for recovery and training.
* **Recent Workouts Log**: Displays your latest exercise sessions, durations, and AI-graded posture scores.

![Dashboard Screenshot](./assets/screenshots/dashboard.png)

---

### 2. AI Squat Trainer (Real-Time Rep Counter)
Uses your camera feed to guide and count your squats with professional feedback.
* **MediaPipe Pose Tracking**: Real-time skeletal coordinate overlays mapping key joints (hips, knees, ankles).
* **Automatic Rep Counting**: Automatically registers a complete rep when you squat parallel (knee angle < 90°) and return to standing.
* **Live Audio/Text Coaching**: Real-time correction alerts such as "Go lower!" or "Good form!".

![AI Trainer Screenshot](./assets/screenshots/squat_trainer.png)

---

### 3. AI Pose Calibration & Analyzer
A dedicated calibration module designed to set up your workout space and verify skeleton detection before starting sessions.
* **Dynamic Layout**: Restructured camera interface that automatically scales to full-screen when active, hiding background noise.
* **Step-by-step Wizard**: Visual guide to calibrating distances and lighting for accurate tracking.

![Pose Analyzer Screenshot](./assets/screenshots/pose_analyzer.png)

---

### 4. AI Diet Coach & BMI Calculator
Custom nutritional planning tailored to your exact physical metrics.
* **BMI Classifier**: Calculates your body mass index, category (e.g., normal, overweight), and ideal target weight.
* **Gemini Meal Planner**: Generates full daily menus (Breakfast, Lunch, Dinner, Snacks) with calories and macros matching your specific goals (e.g., weight loss, muscle gain).
* **Automated Grocery List**: Pulls a complete shopping list based on the recommended meal plan.

![Diet Coach Screenshot](./assets/screenshots/diet_coach.png)

---

### 5. AI Fitness Chatbot (Your Personal Coach)
An interactive chat assistant designed to answer your health, form, and wellness questions.
* **YouTube-Style Input Bar**: A highly visible, spacious rounded-pill message input bar with focused highlights.
* **Swiggy/Paytm-Style Support Menu**: Stacked suggestion cards with neat emojis (🏋️‍♂️, 🥗, 📉, etc.) and hover animations for instant support queries.
* **Dynamic Conversations**: Real-time replies using Gemini LLM.

![AI Chatbot Screenshot](./assets/screenshots/chatbot.png)

---

### 6. Habit Tracker & Consistency Index
Keeps you accountable for your daily health habits.
* **Daily Metrics**: Log water intake, sleep hours, step counts, and mood.
* **Habits Checklist**: Check off items like stretching, reading, or reading clean diets.
* **Consistency Index**: Computes a dynamic daily score reflecting how close you are to reaching your target goals.

![Habit Tracker Screenshot](./assets/screenshots/habit_tracker.png)

---

### 7. User Profile Management Modal
Customizes the application settings to match your personal body stats.
* **Stats Registry**: Keep your age, height, weight, gender, and general activity level updated.
* **Automatic Form Integration**: Diet Coach pre-populates forms using values from this profile, reducing typing effort.
* **Goal Settings**: Set daily targets for sleep hours, steps, and water intake.

![Profile Modal Screenshot](./assets/screenshots/profile_modal.png)

---

## 🛠️ Technology Stack

* **Frontend**: React (Vite), Recharts (Charts), Lucide/Hi Icons, TailwindCSS
* **Backend**: FastAPI (Python), PyMySQL (MySQL Database connection), Uvicorn (ASGI Web Server)
* **AI & Tracking**: Google Gemini API (`google-genai` SDK), Google MediaPipe Pose

---

## 📦 Running the Project Locally

### 1. Prerequisites
* Python 3.10+
* Node.js 18+
* MySQL Server (Database name: `aigym`)

### 2. Environment Setup
Create a `.env` file inside the `backend` directory:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DB=aigym
GEMINI_API_KEY=your_google_gemini_api_key
```

### 3. Start the Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### 4. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.
