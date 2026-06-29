import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import WorkoutTrainer from './pages/WorkoutTrainer'
import DietCoach from './pages/DietCoach'
import HabitTracker from './pages/HabitTracker'
import FitnessChatbot from './pages/FitnessChatbot'
import PoseAnalyzer from './pages/PoseAnalyzer'
import GymRecommender from './pages/GymRecommender'
import Login from './pages/Login'
import { ToastProvider } from './components/Toast'

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workout" element={<WorkoutTrainer />} />
          <Route path="/diet" element={<DietCoach />} />
          <Route path="/habits" element={<HabitTracker />} />
          <Route path="/chatbot" element={<FitnessChatbot />} />
          <Route path="/pose" element={<PoseAnalyzer />} />
          <Route path="/gym" element={<GymRecommender />} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}
