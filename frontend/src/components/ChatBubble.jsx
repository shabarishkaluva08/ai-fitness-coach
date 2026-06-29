export default function ChatBubble({ message, isUser, timestamp }) {
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}
    >
      <div
        className={`max-w-[80%] md:max-w-[70%] px-4 py-3 ${
          isUser ? 'chat-bubble-user' : 'chat-bubble-ai'
        }`}
      >
        {/* Sender label */}
        <p
          className="text-[10px] font-semibold mb-1 uppercase tracking-wider"
          style={{
            color: isUser ? 'rgba(255,255,255,0.7)' : 'var(--color-primary)',
          }}
        >
          {isUser ? 'You' : 'AI Coach'}
        </p>

        {/* Message text */}
        <p
          className="text-sm leading-relaxed whitespace-pre-wrap"
          style={{
            color: isUser ? 'white' : 'var(--text-primary)',
          }}
        >
          {message}
        </p>

        {/* Timestamp */}
        {timestamp && (
          <p
            className="text-[10px] mt-1.5 text-right"
            style={{
              color: isUser ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)',
            }}
          >
            {timestamp}
          </p>
        )}
      </div>
    </div>
  )
}
