import { createContext, useContext, useState, useCallback } from 'react'
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiX } from 'react-icons/hi'

const ToastContext = createContext(null)

let nextId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info') => {
    const id = ++nextId
    setToasts(prev => [...prev, { id, message, type, exiting: false }])

    setTimeout(() => {
      setToasts(prev =>
        prev.map(t => (t.id === id ? { ...t, exiting: true } : t))
      )
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 300)
    }, 3000)

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev =>
      prev.map(t => (t.id === id ? { ...t, exiting: true } : t))
    )
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 300)
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToastContext must be used within ToastProvider')
  return ctx
}

function ToastItem({ toast, onClose }) {
  const config = {
    success: {
      icon: HiCheckCircle,
      bg: 'rgba(16, 185, 129, 0.15)',
      border: 'rgba(16, 185, 129, 0.3)',
      iconColor: '#10B981',
    },
    error: {
      icon: HiXCircle,
      bg: 'rgba(239, 68, 68, 0.15)',
      border: 'rgba(239, 68, 68, 0.3)',
      iconColor: '#EF4444',
    },
    info: {
      icon: HiInformationCircle,
      bg: 'rgba(6, 182, 212, 0.15)',
      border: 'rgba(6, 182, 212, 0.3)',
      iconColor: '#06B6D4',
    },
  }

  const c = config[toast.type] || config.info
  const Icon = c.icon

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl min-w-[280px] max-w-sm ${
        toast.exiting ? 'animate-toast-out' : 'animate-toast-in'
      }`}
      style={{
        backgroundColor: c.bg,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${c.border}`,
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <Icon className="text-xl flex-shrink-0" style={{ color: c.iconColor }} />
      <p className="text-sm font-medium flex-1" style={{ color: 'var(--text-primary)' }}>
        {toast.message}
      </p>
      <button
        onClick={onClose}
        className="p-1 rounded-lg transition-colors hover:bg-white/10 flex-shrink-0"
        style={{ color: 'var(--text-muted)' }}
      >
        <HiX className="text-sm" />
      </button>
    </div>
  )
}
