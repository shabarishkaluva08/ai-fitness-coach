import { useState, createContext, useContext, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopNav from './TopNav'
import ProfileModal from './ProfileModal'
import { useTheme } from '../hooks/useTheme'

export const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {}, isDark: true })
export const UserContext = createContext(null)

export default function Layout() {
  const navigate = useNavigate()
  const { theme, toggleTheme, isDark } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('user_profile')
    return saved ? JSON.parse(saved) : {
      name: 'Venky Athlete',
      age: 24,
      weight: 75,
      height: 180,
      gender: 'male',
      activityLevel: 'Moderately Active',
      dailyWaterGoal: 8,
      dailySleepGoal: 8,
      dailyStepsGoal: 10000,
    }
  })

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('is_logged_in') === 'true'
  })

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('is_logged_in') === 'true'
      setIsLoggedIn(loggedIn)
      if (!loggedIn) {
        navigate('/login')
      }
    }

    checkAuth()

    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [navigate])

  const updateProfile = (newProfile) => {
    setProfile(newProfile)
    localStorage.setItem('user_profile', JSON.stringify(newProfile))
  }

  const logout = () => {
    localStorage.removeItem('is_logged_in')
    setIsLoggedIn(false)
    setIsProfileOpen(false)
    navigate('/login')
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      <UserContext.Provider value={{ profile, updateProfile, isProfileOpen, setIsProfileOpen }}>
        <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="sidebar-overlay md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main content area */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <TopNav onMenuClick={() => setSidebarOpen(true)} />

            <main
              className="flex-1 overflow-y-auto p-4 md:p-6"
              style={{ backgroundColor: 'var(--bg-primary)' }}
            >
              <div className="max-w-7xl mx-auto page-enter">
                <Outlet />
              </div>
            </main>
          </div>
        </div>

        {/* Profile Modal */}
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          profile={profile}
          onSave={updateProfile}
          onLogout={logout}
        />
      </UserContext.Provider>
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  return useContext(ThemeContext)
}

export function useUserContext() {
  return useContext(UserContext)
}

