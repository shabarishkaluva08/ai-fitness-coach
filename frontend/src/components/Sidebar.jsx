import { NavLink } from 'react-router-dom'
import { HiHome, HiLightningBolt, HiBeaker, HiChartBar, HiChatAlt2, HiEye, HiLocationMarker, HiX } from 'react-icons/hi'

const navItems = [
  { path: '/', label: 'Dashboard', icon: HiHome },
  { path: '/workout', label: 'Workout', icon: HiLightningBolt },
  { path: '/diet', label: 'Diet Coach', icon: HiBeaker },
  { path: '/habits', label: 'Habits', icon: HiChartBar },
  { path: '/chatbot', label: 'AI Chat', icon: HiChatAlt2 },
  { path: '/pose', label: 'Pose Analysis', icon: HiEye },
  { path: '/gym', label: 'Find Gym', icon: HiLocationMarker },
]

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside
      className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      style={{
        backgroundColor: 'var(--sidebar-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border-color)',
      }}
    >
      {/* Logo / Brand */}
      <div className="flex items-center justify-between h-16 px-5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center gradient-bg-primary"
            style={{ boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)' }}
          >
            <HiLightningBolt className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">AI Fitness</h1>
            <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
              Smart Gym Assistant
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: 'var(--text-secondary)' }}
        >
          <HiX className="text-xl" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-5 rounded-xl text-base font-semibold transition-all duration-200 group relative ${
                isActive ? 'sidebar-link-active' : 'sidebar-link'
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--color-primary-glow)' : 'transparent',
              color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
            })}
          >
            {({ isActive }) => (
              <>
                {/* Active indicator bar */}
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-10 rounded-r-full"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  />
                )}

                <item.icon
                  className={`text-xl flex-shrink-0 transition-colors ${
                    isActive ? '' : 'group-hover:text-[var(--text-primary)]'
                  }`}
                />
                <span
                  className={`transition-colors ${
                    isActive ? '' : 'group-hover:text-[var(--text-primary)]'
                  }`}
                >
                  {item.label}
                </span>

                {/* Hover background */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/5 transition-colors pointer-events-none" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-4">
        <div
          className="glass-card-static p-3 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(20, 184, 166, 0.05))' }}
        >
          <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
            🔥 Stay Consistent
          </p>
          <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
            You're on a 12-day streak!
          </p>
        </div>
      </div>
    </aside>
  )
}
