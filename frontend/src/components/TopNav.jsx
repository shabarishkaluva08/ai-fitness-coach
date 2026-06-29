import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { HiMenu, HiSearch, HiBell, HiSun, HiMoon } from 'react-icons/hi'
import { useThemeContext, useUserContext } from './Layout'

const pageTitles = {
  '/': 'Dashboard',
  '/workout': 'Workout Trainer',
  '/diet': 'Diet Coach',
  '/habits': 'Habit Tracker',
  '/chatbot': 'AI Chatbot',
  '/pose': 'Pose Analyzer',
  '/gym': 'Gym Finder',
}

const searchItems = [
  {
    title: 'Dashboard',
    category: 'Pages',
    description: 'Overview of your stats and recent activities',
    path: '/',
    keywords: ['dashboard', 'home', 'stats', 'overview', 'weekly', 'athlete', 'summary'],
  },
  {
    title: 'Workout Trainer',
    category: 'Pages',
    description: 'Log and track workouts and view history',
    path: '/workout',
    keywords: ['workout', 'trainer', 'exercise', 'reps', 'squats', 'push-ups', 'bicep', 'deadlifts', 'gym', 'weights', 'cardio', 'log workout'],
  },
  {
    title: 'Diet Coach',
    category: 'Pages',
    description: 'Calculate BMI, generate diet plans & grocery lists',
    path: '/diet',
    keywords: ['diet', 'coach', 'meals', 'food', 'nutrition', 'recipe', 'calories', 'protein', 'carbs', 'fat', 'bmi', 'calculator', 'grocery', 'eat'],
  },
  {
    title: 'Habit Tracker',
    category: 'Pages',
    description: 'Track daily habits like water, sleep, and steps',
    path: '/habits',
    keywords: ['habits', 'tracker', 'water', 'sleep', 'steps', 'mood', 'notes', 'daily goals', 'routine'],
  },
  {
    title: 'AI Chatbot',
    category: 'Pages',
    description: 'Personalized fitness & nutrition advice with Gemini',
    path: '/chatbot',
    keywords: ['chatbot', 'ai', 'gemini', 'chat', 'ask', 'assistant', 'advisor', 'coach', 'help'],
  },
  {
    title: 'Pose Analyzer',
    category: 'Pages',
    description: 'Real-time AI posture assessment using your camera',
    path: '/pose',
    keywords: ['pose', 'analyzer', 'posture', 'camera', 'real-time', 'calibration', 'vision', 'form score'],
  },
  {
    title: 'Gym Finder',
    category: 'Pages',
    description: 'Find local gyms and fitness centers near you',
    path: '/gym',
    keywords: ['gym finder', 'location', 'near me', 'gyms', 'map', 'places', 'recommender'],
  }
]

export default function TopNav({ onMenuClick }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useThemeContext()
  const { profile, setIsProfileOpen } = useUserContext()
  const title = pageTitles[location.pathname] || 'AI Fitness'

  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const searchRef = useRef(null)

  // Extract initials from profile name
  const getInitials = (name) => {
    if (!name) return 'VA'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + (parts[1][0] || '')).toUpperCase()
  }

  // Filter search results
  const filteredResults = searchQuery.trim() === ''
    ? searchItems.slice(0, 4) // Show first 4 pages as quick suggestions if empty
    : searchItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      )

  // Group filtered results by category
  const groupedResults = filteredResults.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectItem = (item) => {
    setIsSearchOpen(false)
    setSearchQuery('')
    navigate(item.path)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % filteredResults.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredResults[activeIndex]) {
        handleSelectItem(filteredResults[activeIndex])
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false)
    }
  }

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-6"
      style={{
        backgroundColor: 'var(--topnav-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      {/* Left: Menu + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: 'var(--text-secondary)' }}
        >
          <HiMenu className="text-xl" />
        </button>
        <div>
          <h2
            className="text-lg font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h2>
        </div>
      </div>

      {/* Center: Search (hidden on mobile) */}
      <div className="hidden md:flex flex-1 max-w-md mx-8 relative" ref={searchRef}>
        <div className="relative w-full">
          <HiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search pages, workouts, diet..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setIsSearchOpen(true)
              setActiveIndex(0)
            }}
            onFocus={() => setIsSearchOpen(true)}
            onKeyDown={handleKeyDown}
            className="input-field pl-9 text-sm w-full"
            style={{ backgroundColor: 'var(--bg-input)' }}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('')
                setIsSearchOpen(false)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-white/10 text-xs text-[var(--text-secondary)]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {isSearchOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl overflow-hidden max-h-96 z-50 flex flex-col"
            style={{ backgroundColor: 'var(--bg-secondary)', backdropFilter: 'blur(20px)' }}
          >
            <div className="overflow-y-auto p-2">
              {filteredResults.length > 0 ? (
                <div>
                  {Object.entries(groupedResults).map(([category, items]) => (
                    <div key={category} className="mb-2">
                      <div className="px-3 py-1 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        {category === 'Pages' && searchQuery.trim() === '' ? 'Quick Links' : category}
                      </div>
                      <div className="space-y-0.5">
                        {items.map((item) => {
                          const globalIdx = filteredResults.indexOf(item)
                          const isActive = globalIdx === activeIndex
                          return (
                            <button
                              key={item.title}
                              onClick={() => handleSelectItem(item)}
                              onMouseEnter={() => setActiveIndex(globalIdx)}
                              className={`w-full text-left flex flex-col px-3 py-2 rounded-lg transition-all ${
                                isActive
                                  ? 'bg-[var(--color-primary)] text-white'
                                  : 'hover:bg-white/5 text-[var(--text-primary)]'
                              }`}
                            >
                              <span className="text-sm font-semibold">{item.title}</span>
                              <span
                                className={`text-xs ${
                                  isActive ? 'text-white/80' : 'text-[var(--text-secondary)]'
                                }`}
                              >
                                {item.description}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-4 text-center text-sm text-[var(--text-secondary)]">
                  No results found for <span className="font-semibold">"{searchQuery}"</span>
                </div>
              )}
            </div>
            <div className="border-t border-[var(--border-color)] px-3 py-1.5 flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
              <span>Use ↑↓ to navigate, Enter to select</span>
              <span>ESC to close</span>
            </div>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: 'var(--bg-card)',
            color: isDark ? '#F59E0B' : '#8B5CF6',
            border: '1px solid var(--border-color)',
          }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <HiSun className="text-lg" /> : <HiMoon className="text-lg" />}
        </button>

        {/* Notifications */}
        <button
          className="relative p-2.5 rounded-xl transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
          }}
        >
          <HiBell className="text-lg" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* User Avatar */}
        <div
          onClick={() => setIsProfileOpen(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
            color: 'white',
          }}
          title="Edit Profile"
        >
          {getInitials(profile?.name)}
        </div>
      </div>
    </header>
  )
}

