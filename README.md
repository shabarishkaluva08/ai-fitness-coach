# 🏋️‍♂️ AI Fitness Coach

**AI Fitness Coach** is an AI-powered personal fitness and wellness platform that continuously tracks workout form using computer vision, generates personalized nutrition plans, provides real-time AI coaching, and delivers actionable health insights — all through a premium dark-themed enterprise dashboard.

---

## 🚀 Features

-  Real-time Pose Estimation & Skeletal Tracking
-  Automatic Squat Rep Counter with Form Grading
-  AI-powered Fitness Chatbot (Google Gemini LLM)
-  Personalized Diet & Meal Plan Generator
-  Dynamic Weekly Activity Charts with AI Insights
-  BMI Calculator with Health Classification
-  Daily Habit Tracker & Consistency Scoring
-  Workout Logging & History Management
-  User Authentication & Profile Management
-  Fully Responsive Glassmorphic UI

---

## 🏗️ System Architecture

```
Camera Feed
    ↓
MediaPipe Pose Detection
    ↓
Joint Angle Calculation (Hip, Knee, Ankle)
    ↓
AI Form Analysis Engine
    ↓
Fitness Actions
    ├── Count Reps Automatically
    ├── Grade Exercise Form (0-100)
    ├── Provide Real-time Corrections
    └── Log Workout to Database
    ↓
Gemini AI Engine
    ├── Generate Motivational Quotes
    ├── Analyze Weekly Chart Data
    ├── Create Personalized Meal Plans
    └── Answer Fitness Questions
    ↓
Enterprise Dashboard
```

---

## 🖥️ Technology Stack

| Layer              | Technology                                          |
|--------------------|-----------------------------------------------------|
| **Frontend**       | React, Vite, TailwindCSS, Recharts, Framer Motion   |
| **Backend**        | Python, FastAPI, Uvicorn (ASGI)                      |
| **Database**       | MySQL (PyMySQL)                                      |
| **AI / LLM**       | Google Gemini API (`google-genai` SDK, `gemini-2.5-flash`) |
| **Computer Vision** | Google MediaPipe Pose (Browser-side, WASM/SIMD)     |
| **Styling**        | Glassmorphism, CSS Variables, Dark Theme              |

---

## 🔄 Workflow

1. User logs in through the **themed authentication page**.
2. **Dashboard** loads real-time fitness metrics, weekly charts, and Gemini AI-generated insights.
3. User navigates to **AI Squat Trainer**:
   - Camera activates and MediaPipe tracks body landmarks.
   - Joint angles are calculated in real-time (hip-knee-ankle).
   - Reps are counted automatically when proper squat depth is achieved.
   - Live text feedback guides form corrections.
4. User visits **Diet Coach**:
   - Profile data (age, weight, height, goal) auto-populates the form.
   - Gemini AI generates a full-day meal plan with macros and a grocery list.
5. User opens **AI Chatbot**:
   - Quick-action suggestion cards (Swiggy/Paytm style) offer common queries.
   - Gemini LLM responds with detailed, contextual fitness advice.
6. **Habit Tracker** logs daily water intake, sleep, steps, mood, and workout completion.
7. All data is persisted to **MySQL** and visualized across the dashboard.

---

## 📂 Project Structure

```
ai-fitness-coach/
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Layout, Sidebar, TopNav, Modals, Charts
│   │   ├── pages/            # Dashboard, DietCoach, Chatbot, Trainer, Habits
│   │   ├── hooks/            # useMediaPipe, useTheme, useToast
│   │   ├── services/         # API client (Axios)
│   │   ├── utils/            # Pose math utilities
│   │   ├── assets/           # Images, icons
│   │   └── index.css         # Global theme & design tokens
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── database/             # MySQL connection & queries
│   ├── models/               # Pydantic schemas
│   ├── routers/              # FastAPI route handlers
│   ├── services/             # Gemini AI & analytics services
│   ├── main.py               # App entry point
│   ├── requirements.txt
│   └── .env
│
├── assets/
│   └── screenshots/          # Project screenshots
│
└── README.md
```

---

## 🎯 Problem Statement

Traditional fitness apps rely on **manual input** — users must count their own reps, guess their form quality, and follow generic meal plans. There is no real-time verification of whether an exercise is performed correctly, leading to injuries and ineffective training.

**AI Fitness Coach** solves this by combining **computer vision** for autonomous exercise tracking with **generative AI** for personalized coaching — creating an intelligent fitness companion that watches, corrects, plans, and motivates.

---

## 💡 Key Highlights

- **Autonomous AI Fitness Agent** — Tracks, counts, and grades exercises without manual input
-  **Real-time Computer Vision** — MediaPipe skeletal tracking directly in the browser
-  **Gemini LLM Integration** — Powers chatbot, meal plans, motivational quotes, and chart analytics
-  **Premium Dark UI** — Glassmorphic cards, gradient accents, micro-animations
-  **Graceful Fallbacks** — Every AI feature defaults to curated mock data when API quota is exhausted
-  **Fully Responsive** — Works seamlessly on desktop, tablet, and mobile
-  **Persistent Storage** — All workouts, habits, and chat history saved to MySQL

---

## 📈 Future Scope

-  Multi-exercise Support (Push-ups, Lunges, Planks)
-  Workout Session Recording & Playback
-  Google Places API Gym Finder Integration
-  Multi-user Authentication (JWT)
-  Cloud Database Synchronization
-  Mobile App (React Native)
-  Weekly/Monthly Progress Reports (PDF Export)
-  Gamification & Achievement Badges

---

## 📷 Screenshots

### Dashboard

![Dashboard]<img width="1917" height="868" alt="Screenshot 2026-06-29 165911" src="https://github.com/user-attachments/assets/a8741af2-cf2c-47b4-89b2-39ad57327dfe" />


### AI Squat Trainer

![AI Trainer]<img width="1912" height="865" alt="Screenshot 2026-06-29 170005" src="https://github.com/user-attachments/assets/6bac6e55-0950-4ae5-9896-d7e574daf8f1" />


### AI Pose Analyzer

![Pose Analyzer]<img width="1916" height="871" alt="Screenshot 2026-06-29 170153" src="https://github.com/user-attachments/assets/bfb0a460-a1f5-4efb-8a4c-4444594491ee" />


### AI Diet Coach & BMI Calculator

![Diet Coach]<img width="1917" height="872" alt="Screenshot 2026-06-29 170025" src="https://github.com/user-attachments/assets/a4beccc0-44d0-4d2a-8c17-814e31f11688" />

### AI Fitness Chatbot

![Chatbot]<img width="1917" height="868" alt="Screenshot 2026-06-29 170116" src="https://github.com/user-attachments/assets/1ef81680-391c-4fae-a0ce-dd5dec58c805" />


### Habit Tracker

![Habit Tracker]<img width="1917" height="868" alt="Screenshot 2026-06-29 170116" src="https://github.com/user-attachments/assets/fae3e31c-893b-46bb-b673-137d80fe5de4" />


### Profile Management

![Profile Modal]<img width="1900" height="857" alt="Screenshot 2026-06-29 165854" src="https://github.com/user-attachments/assets/838b877a-203d-4a91-ae9d-d11a65bdd10a" />


---

## 📦 Running the Project Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL Server

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create `backend/.env`:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DB=aigym
GEMINI_API_KEY=your_gemini_api_key
```


---


- **Shabarish Kaluva**


---

## 📜 License

This project was developed for educational and major project evaluation purposes.
