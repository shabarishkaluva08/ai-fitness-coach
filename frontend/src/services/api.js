import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Can add auth tokens here later
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.detail || error.response?.data?.message || error.message || 'Something went wrong'
    console.error('API Error:', message)
    return Promise.reject({ message, status: error.response?.status })
  }
)

// ── Dashboard ──────────────────────────────────────
export async function getDashboard() {
  try {
    return await api.get('/dashboard')
  } catch (error) {
    console.error('getDashboard failed:', error)
    throw error
  }
}

// ── Diet / BMI ─────────────────────────────────────
export async function calculateBMI(data) {
  try {
    return await api.post('/calculate-bmi', data)
  } catch (error) {
    console.error('calculateBMI failed:', error)
    throw error
  }
}

export async function generateDietPlan(data) {
  try {
    return await api.post('/generate-diet-plan', data)
  } catch (error) {
    console.error('generateDietPlan failed:', error)
    throw error
  }
}

// ── Chat ───────────────────────────────────────────
export async function sendChat(data) {
  try {
    return await api.post('/chat', data)
  } catch (error) {
    console.error('sendChat failed:', error)
    throw error
  }
}

// ── Workouts ───────────────────────────────────────
export async function saveWorkout(data) {
  try {
    return await api.post('/save-workout', data)
  } catch (error) {
    console.error('saveWorkout failed:', error)
    throw error
  }
}

export async function getWorkoutHistory() {
  try {
    return await api.get('/workout-history')
  } catch (error) {
    console.error('getWorkoutHistory failed:', error)
    throw error
  }
}

// ── Analytics ──────────────────────────────────────
export async function getAnalytics() {
  try {
    return await api.get('/analytics')
  } catch (error) {
    console.error('getAnalytics failed:', error)
    throw error
  }
}

// ── Habits ─────────────────────────────────────────
export async function saveHabit(data) {
  try {
    return await api.post('/save-habit', data)
  } catch (error) {
    console.error('saveHabit failed:', error)
    throw error
  }
}

export async function getHabits() {
  try {
    return await api.get('/habits')
  } catch (error) {
    console.error('getHabits failed:', error)
    throw error
  }
}

export default api
