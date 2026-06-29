import { useState, useEffect } from 'react'
import { HiLightningBolt, HiFire, HiTrendingUp, HiClock, HiChevronRight, HiPlay } from 'react-icons/hi'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../components/StatCard'
import ChartCard from '../components/ChartCard'
import { getDashboard } from '../services/api'
import { useUserContext } from '../components/Layout'

const mockWeeklyData = [
  { day: 'Mon', calories: 1800, minutes: 35 },
  { day: 'Tue', calories: 2100, minutes: 50 },
  { day: 'Wed', calories: 1650, minutes: 25 },
  { day: 'Thu', calories: 2300, minutes: 60 },
  { day: 'Fri', calories: 1900, minutes: 40 },
  { day: 'Sat', calories: 2500, minutes: 75 },
  { day: 'Sun', calories: 1750, minutes: 30 },
]

const mockRecentWorkouts = [
  { id: 1, exercise: 'Barbell Squats', reps: '4×12', date: 'Today', score: 92, icon: '🏋️' },
  { id: 2, exercise: 'Push-ups', reps: '3×20', date: 'Yesterday', score: 88, icon: '💪' },
  { id: 3, exercise: 'Bicep Curls', reps: '3×15', date: '2 days ago', score: 95, icon: '🔥' },
  { id: 4, exercise: 'Deadlifts', reps: '5×8', date: '3 days ago', score: 85, icon: '🦾' },
]

const quickActions = [
  { label: 'Start Workout', icon: HiPlay, gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)' },
  { label: 'Log Meal', icon: HiFire, gradient: 'linear-gradient(135deg, #14B8A6, #0D9488)' },
  { label: 'Track Habits', icon: HiTrendingUp, gradient: 'linear-gradient(135deg, #10B981, #059669)' },
]

export default function Dashboard() {
  const [data, setData] = useState(null)
  const { profile } = useUserContext()

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getDashboard()
        setData(result)
      } catch {
        // Use mock data on failure
        setData(null)
      }
    }
    fetchData()
  }, [])

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Format stats values from backend data
  const fitnessScoreVal = data?.fitness_score !== undefined ? `${data.fitness_score}/100` : "78/100"
  const caloriesVal = data?.calories_consumed !== undefined ? `${data.calories_consumed.toLocaleString()} kcal` : "1,850 kcal"
  const streakVal = data?.workout_streak !== undefined ? `${data.workout_streak} days` : "12 days"
  const activeMinVal = data?.active_minutes !== undefined ? `${data.active_minutes} min` : "45 min"

  // Weekly data mapping
  const chartData = data?.weekly_data || mockWeeklyData
  const showSteps = chartData[0] && chartData[0].steps !== undefined && chartData[0].steps > 0

  // Recent workouts mapping
  const recentWorkouts = data?.recent_workouts || mockRecentWorkouts

  return (
    <div className="animate-fade-in space-y-6">
      {/* Welcome Hero */}
      <div
        className="glass-card p-6 md:p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(20,184,166,0.08), rgba(16,185,129,0.05))',
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #14B8A6, transparent)' }}
        />

        <div className="relative z-10">
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            {today}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{profile?.name || 'Athlete'}</span>! 💪
          </h1>
          <p className="text-sm max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {data?.motivation_quote || "You've been crushing it lately! Your fitness score is up 12% this week. Keep pushing — consistency is the key to greatness."}
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-5">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
                style={{ background: action.gradient }}
              >
                <action.icon className="text-base" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard
          icon={HiTrendingUp}
          title="Fitness Score"
          value={fitnessScoreVal}
          subtitle="Great progress!"
          trend="up"
          color="violet"
        />
        <StatCard
          icon={HiFire}
          title="Calories Burned"
          value={caloriesVal}
          subtitle="Today's burn"
          trend="up"
          color="cyan"
        />
        <StatCard
          icon={HiLightningBolt}
          title="Active Streak"
          value={streakVal}
          subtitle="Personal best!"
          trend="up"
          color="emerald"
        />
        <StatCard
          icon={HiClock}
          title="Active Minutes"
          value={activeMinVal}
          subtitle="Today's activity"
          trend="down"
          color="amber"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 space-y-4">
          <ChartCard
            title="Weekly Activity"
            subtitle="Calories & workout metrics over the past week"
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    fontSize: '13px',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                  labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="calories"
                  stroke="#06B6D4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCalories)"
                  name="Calories"
                />
                {showSteps ? (
                  <Area
                    type="monotone"
                    dataKey="steps"
                    stroke="#14B8A6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorMinutes)"
                    name="Steps"
                  />
                ) : (
                  <Area
                    type="monotone"
                    dataKey="minutes"
                    stroke="#14B8A6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorMinutes)"
                    name="Minutes"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>

            {/* AI Insights Block */}
            {data?.chart_insights && (
              <div className="mt-4 p-4 rounded-xl border border-[var(--border-color)] bg-[#050D12]/40 relative overflow-hidden group">
                <div
                  className="absolute -top-10 -left-10 w-24 h-24 rounded-full opacity-10 blur-2xl transition-transform duration-500 group-hover:scale-150"
                  style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }}
                />
                <div className="relative z-10 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    AI Weekly Insights
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {data.chart_insights}
                  </p>
                </div>
              </div>
            )}
          </ChartCard>
        </div>

        {/* Recent Workouts */}
        <div>
          <ChartCard title="Recent Workouts" subtitle="Your latest sessions">
            <div className="space-y-3">
              {recentWorkouts.map((workout, index) => {
                const exercise = workout.exercise || "Workout"
                const duration = workout.duration || (workout.calories ? `${workout.calories} kcal` : "30 min")
                const score = workout.form_score || workout.score || 85
                const date = workout.date || "Today"
                const icon = workout.icon || (
                  exercise.toLowerCase().includes("squat") ? "🏋️" :
                  exercise.toLowerCase().includes("push") ? "💪" :
                  exercise.toLowerCase().includes("curl") ? "🔥" :
                  exercise.toLowerCase().includes("dead") ? "🦾" : "🏋️"
                )

                return (
                  <div
                    key={workout.id || index}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer group"
                    style={{
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color-hover)'
                      e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'transparent'
                      e.currentTarget.style.backgroundColor = 'var(--bg-input)'
                    }}
                  >
                    <span className="text-xl">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {exercise}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {duration} · {date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-bold px-2 py-1 rounded-lg"
                        style={{
                          backgroundColor: 'rgba(139, 92, 246, 0.12)',
                          color: '#8B5CF6',
                        }}
                      >
                        {score}%
                      </span>
                      <HiChevronRight
                        className="text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: 'var(--text-muted)' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
