export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className={`${sizeMap[size]} relative`}>
        <div
          className="absolute inset-0 rounded-full animate-spin-slow"
          style={{
            border: '3px solid var(--border-color)',
            borderTopColor: 'var(--color-primary)',
          }}
        />
        <div
          className="absolute inset-1 rounded-full animate-spin-slow"
          style={{
            border: '2px solid transparent',
            borderTopColor: 'var(--color-cyan)',
            animationDirection: 'reverse',
            animationDuration: '1.5s',
          }}
        />
      </div>
      {text && (
        <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--text-muted)' }}>
          {text}
        </p>
      )}
    </div>
  )
}
