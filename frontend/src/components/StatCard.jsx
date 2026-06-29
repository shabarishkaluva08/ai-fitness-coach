import { useEffect, useState } from 'react'
import { HiArrowUp, HiArrowDown } from 'react-icons/hi'

export default function StatCard({ icon: Icon, title, value, subtitle, trend, color = 'violet' }) {
  const [displayValue, setDisplayValue] = useState(0)
  const numericValue = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, ''), 10) : value

  const colorMap = {
    violet: {
      bg: 'rgba(6, 182, 212, 0.12)',
      icon: '#06B6D4',
      glow: '0 0 20px rgba(6, 182, 212, 0.2)',
    },
    cyan: {
      bg: 'rgba(6, 182, 212, 0.12)',
      icon: '#06B6D4',
      glow: '0 0 20px rgba(6, 182, 212, 0.2)',
    },
    emerald: {
      bg: 'rgba(16, 185, 129, 0.12)',
      icon: '#10B981',
      glow: '0 0 20px rgba(16, 185, 129, 0.2)',
    },
    amber: {
      bg: 'rgba(245, 158, 11, 0.12)',
      icon: '#F59E0B',
      glow: '0 0 20px rgba(245, 158, 11, 0.2)',
    },
  }

  const c = colorMap[color] || colorMap.violet

  // Animate number on mount
  useEffect(() => {
    if (isNaN(numericValue)) {
      setDisplayValue(value)
      return
    }

    let start = 0
    const end = numericValue
    const duration = 1000
    const increment = end / (duration / 16)
    let current = start

    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        current = end
        clearInterval(timer)
      }
      setDisplayValue(Math.floor(current))
    }, 16)

    return () => clearInterval(timer)
  }, [numericValue, value])

  const formatValue = () => {
    if (typeof value === 'string') {
      // Replace the numeric part with animated value
      return value.replace(/[0-9,]+/, displayValue.toLocaleString())
    }
    return displayValue.toLocaleString()
  }

  return (
    <div className="glass-card p-5 group">
      <div className="flex items-start justify-between mb-3">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: c.bg, boxShadow: c.glow }}
        >
          {Icon && <Icon className="text-xl" style={{ color: c.icon }} />}
        </div>

        {/* Trend */}
        {trend && (
          <div
            className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg"
            style={{
              backgroundColor: trend === 'up' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              color: trend === 'up' ? '#10B981' : '#EF4444',
            }}
          >
            {trend === 'up' ? <HiArrowUp /> : <HiArrowDown />}
            {trend === 'up' ? '+12%' : '-5%'}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="animate-count-up">
        <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {formatValue()}
        </p>
      </div>

      {/* Title */}
      <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>
        {title}
      </p>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
