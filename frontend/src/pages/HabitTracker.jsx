import { useState, useMemo, useEffect } from 'react'
import { HiChevronLeft, HiChevronRight, HiCheck, HiSave } from 'react-icons/hi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ChartCard from '../components/ChartCard'
import { useToastContext } from '../components/Toast'
import { saveHabit, getHabits } from '../services/api'

const defaultHabits = [
  { id: 'workout', label: 'Morning Workout', emoji: '🏋️' },
  { id: 'meditation', label: 'Meditation', emoji: '🧘' },
  { id: 'breakfast', label: 'Healthy Breakfast', emoji: '🥗' },
  { id: 'vitamins', label: 'Take Vitamins', emoji: '💊' },
  { id: 'walk', label: 'Evening Walk', emoji: '🚶' },
]

export default function HabitTracker() {
  const { addToast } = useToastContext()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [habits, setHabits] = useState({})
  const [waterIntake, setWaterIntake] = useState(0)
  const [sleepHours, setSleepHours] = useState(7)
  const [weeklyScores, setWeeklyScores] = useState([
    { day: 'Mon', score: 0 },
    { day: 'Tue', score: 0 },
    { day: 'Wed', score: 0 },
    { day: 'Thu', score: 0 },
    { day: 'Fri', score: 0 },
    { day: 'Sat', score: 0 },
    { day: 'Sun', score: 0 },
  ])

  // Load habit history from backend
  useEffect(() => {
    async function fetchHabits() {
      try {
        const data = await getHabits()
        if (data?.habits && data.habits.length > 0) {
          // Build weekly scores from saved habits
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          const scores = data.habits.slice(0, 7).map(h => {
            const d = new Date(h.date)
            return {
              day: dayNames[d.getDay()],
              score: h.score || Math.round(
                ((h.workout_done ? 1 : 0) * 40 +
                (Math.min(h.water_glasses || h.water_intake || 0, 8) / 8) * 30 +
                (Math.min(h.sleep_hours || 0, 8) / 8) * 30)
              ),
            }
          })
          setWeeklyScores(scores)

          // Load today's data if available
          const todayStr = new Date().toISOString().split('T')[0]
          const todayHabit = data.habits.find(h => h.date === todayStr)
          if (todayHabit) {
            setWaterIntake(todayHabit.water_intake || todayHabit.water_glasses || 0)
            setSleepHours(todayHabit.sleep_hours || 7)
            if (todayHabit.habits) setHabits(todayHabit.habits)
          }
        }
      } catch {
        // Use defaults on error
      }
    }
    fetchHabits()
  }, [])

  const dateStr = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const navigateDate = (direction) => {
    setCurrentDate(prev => {
      const d = new Date(prev)
      d.setDate(d.getDate() + direction)
      return d
    })
  }

  const toggleHabit = (id) => {
    setHabits(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const completedHabits = Object.values(habits).filter(Boolean).length
  const totalHabits = defaultHabits.length
  const consistencyScore = useMemo(() => {
    const habitScore = (completedHabits / totalHabits) * 40
    const waterScore = (Math.min(waterIntake, 8) / 8) * 30
    const sleepScore = (Math.min(sleepHours, 8) / 8) * 30
    return Math.round(habitScore + waterScore + sleepScore)
  }, [completedHabits, totalHabits, waterIntake, sleepHours])

  const handleSave = async () => {
    try {
      await saveHabit({
        date: currentDate.toISOString().split('T')[0],
        habits,
        water_intake: waterIntake,
        sleep_hours: sleepHours,
        score: consistencyScore,
      })
      addToast('Habits saved successfully!', 'success')
    } catch {
      addToast('Saved locally (offline mode)', 'info')
    }
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Date Navigation */}
      <div className="glass-card p-4 flex items-center justify-between">
        <button
          onClick={() => navigateDate(-1)}
          className="p-2 rounded-xl transition-all hover:scale-110"
          style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}
        >
          <HiChevronLeft className="text-lg" />
        </button>
        <div className="text-center">
          <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            {dateStr}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {currentDate.toDateString() === new Date().toDateString() ? "Today" : ""}
          </p>
        </div>
        <button
          onClick={() => navigateDate(1)}
          className="p-2 rounded-xl transition-all hover:scale-110"
          style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}
        >
          <HiChevronRight className="text-lg" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Habits + Water */}
        <div className="lg:col-span-2 space-y-6">
          {/* Habit Checklist */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Daily Habits ({completedHabits}/{totalHabits})
            </h3>
            <div className="space-y-3">
              {defaultHabits.map((habit) => (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className="w-full flex items-center gap-4 p-3.5 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: habits[habit.id] ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-input)',
                    border: `1px solid ${habits[habit.id] ? 'rgba(16, 185, 129, 0.3)' : 'transparent'}`,
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      backgroundColor: habits[habit.id] ? '#10B981' : 'transparent',
                      border: habits[habit.id] ? 'none' : '2px solid var(--border-color-hover)',
                    }}
                  >
                    {habits[habit.id] && <HiCheck className="text-white text-sm" />}
                  </div>
                  <span className="text-lg">{habit.emoji}</span>
                  <span
                    className={`text-sm font-medium flex-1 text-left transition-all ${
                      habits[habit.id] ? 'line-through' : ''
                    }`}
                    style={{
                      color: habits[habit.id] ? 'var(--text-muted)' : 'var(--text-primary)',
                    }}
                  >
                    {habit.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Water Intake */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              💧 Water Intake
            </h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              {waterIntake}/8 glasses
            </p>
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setWaterIntake(i + 1)}
                  className="relative w-12 h-16 rounded-xl overflow-hidden transition-all duration-300 hover:scale-110"
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    border: `1px solid ${i < waterIntake ? 'rgba(6, 182, 212, 0.3)' : 'var(--border-color)'}`,
                  }}
                >
                  {/* Water fill */}
                  <div
                    className="absolute bottom-0 left-0 right-0 water-fill rounded-b-lg"
                    style={{
                      height: i < waterIntake ? '100%' : '0%',
                      background: 'linear-gradient(to top, rgba(6, 182, 212, 0.4), rgba(6, 182, 212, 0.15))',
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-lg">
                    {i < waterIntake ? '💧' : '🥛'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sleep Tracker */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              😴 Sleep Tracker
            </h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              {sleepHours} hours of sleep
            </p>

            <div className="flex items-center gap-4">
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>0h</span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #8B5CF6 ${(sleepHours / 12) * 100}%, var(--bg-input) ${(sleepHours / 12) * 100}%)`,
                  }}
                />
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>12h</span>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <div
                className="text-3xl font-black"
                style={{
                  color: sleepHours >= 7 ? '#10B981' : sleepHours >= 5 ? '#F59E0B' : '#EF4444',
                }}
              >
                {sleepHours}h
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {sleepHours >= 7 ? '😊 Great sleep!' : sleepHours >= 5 ? '😐 Could be better' : '😴 Need more rest'}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Recommended: 7-9 hours
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Score + Chart */}
        <div className="space-y-6">
          {/* Consistency Score */}
          <div className="glass-card p-6 text-center">
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
              Today's Score
            </h3>

            <div className="relative inline-flex items-center justify-center mb-3">
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle
                  cx="70" cy="70" r="60"
                  fill="none"
                  stroke="var(--bg-input)"
                  strokeWidth="10"
                />
                <circle
                  cx="70" cy="70" r="60"
                  fill="none"
                  stroke={consistencyScore >= 70 ? '#10B981' : consistencyScore >= 40 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(consistencyScore / 100) * 377} 377`}
                  transform="rotate(-90 70 70)"
                  style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-3xl font-black"
                  style={{
                    color: consistencyScore >= 70 ? '#10B981' : consistencyScore >= 40 ? '#F59E0B' : '#EF4444',
                  }}
                >
                  {consistencyScore}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/ 100</span>
              </div>
            </div>

            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {consistencyScore >= 70 ? '🔥 Crushing it!' : consistencyScore >= 40 ? '💪 Keep going!' : '🌱 Every step counts!'}
            </p>
          </div>

          {/* Weekly Chart */}
          <ChartCard title="7-Day Trend" subtitle="Your weekly consistency">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyScores} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey="score"
                  fill="#8B5CF6"
                  radius={[6, 6, 0, 0]}
                  name="Score"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="btn-primary w-full justify-center py-3"
          >
            <HiSave />
            Save Today's Progress
          </button>
        </div>
      </div>
    </div>
  )
}
