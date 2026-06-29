import { useState, useRef, useEffect } from 'react'
import { HiPaperAirplane } from 'react-icons/hi'
import ChatBubble from '../components/ChatBubble'
import { sendChat } from '../services/api'

const quickSuggestions = [
  { text: 'Workout for beginners', emoji: '🏋️‍♂️' },
  { text: 'High protein diet', emoji: '🥗' },
  { text: 'How to lose weight', emoji: '📉' },
  { text: 'Best exercises for abs', emoji: '💪' },
  { text: 'Post-workout recovery tips', emoji: '🧘' },
  { text: 'How to improve flexibility', emoji: '🤸' },
]

const initialMessages = [
  {
    id: 1,
    message: "Hey there! 👋 I'm your AI Fitness Coach. I can help you with workout plans, nutrition advice, exercise form tips, and more. What would you like to know?",
    isUser: false,
    timestamp: 'Just now',
  },
]

export default function FitnessChatbot() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const getTimestamp = () => {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const generateMockResponse = (userMsg) => {
    const msg = userMsg.toLowerCase()
    if (msg.includes('beginner') || msg.includes('start')) {
      return "Great question! For beginners, I recommend starting with:\n\n1. 🏋️ **Bodyweight exercises** - Push-ups, squats, lunges\n2. 🚶 **Walking** - 30 minutes daily\n3. 🧘 **Stretching** - 10 minutes morning routine\n\nStart with 3 days per week and gradually increase. Remember, consistency beats intensity!"
    }
    if (msg.includes('protein') || msg.includes('diet')) {
      return "Here are some excellent high-protein foods:\n\n🥚 Eggs - 6g per egg\n🍗 Chicken breast - 31g per 100g\n🐟 Salmon - 25g per 100g\n🥛 Greek yogurt - 10g per 100g\n🫘 Lentils - 9g per 100g\n\nAim for 1.6-2.2g of protein per kg of bodyweight for muscle building!"
    }
    if (msg.includes('lose weight') || msg.includes('fat')) {
      return "For healthy weight loss:\n\n📉 **Caloric deficit** - Eat 300-500 fewer calories\n🏃 **Cardio** - 150 min/week moderate intensity\n💪 **Strength training** - Preserves muscle mass\n💧 **Hydration** - 8+ glasses of water daily\n😴 **Sleep** - 7-9 hours per night\n\nAim for 0.5-1 kg per week — slow and steady wins the race!"
    }
    if (msg.includes('abs') || msg.includes('core')) {
      return "Best exercises for defined abs:\n\n1. 🔄 **Planks** - 3 sets, 30-60 seconds\n2. 🚲 **Bicycle crunches** - 3×20 reps\n3. 🦵 **Leg raises** - 3×15 reps\n4. 🏔️ **Mountain climbers** - 3×30 seconds\n\nRemember: Abs are made in the kitchen! You need low body fat percentage to see them."
    }
    if (msg.includes('recovery') || msg.includes('rest')) {
      return "Post-workout recovery tips:\n\n🧊 **Cool down** - 5-10 min light stretching\n🥤 **Protein shake** - Within 30 min of workout\n💧 **Rehydrate** - Water + electrolytes\n🛁 **Cold/contrast shower** - Reduces inflammation\n😴 **Quality sleep** - When most repair happens\n🧘 **Foam rolling** - Reduces muscle soreness"
    }
    return "That's a great question! Here are my thoughts:\n\n💡 Focus on compound movements for maximum efficiency\n🎯 Set realistic, measurable goals\n📊 Track your progress weekly\n🍎 Nutrition is 80% of the equation\n\nWould you like me to create a specific plan for you? Just tell me your fitness goal!"
  }

  const handleSend = async (text = null) => {
    const messageText = text || input.trim()
    if (!messageText) return

    const userMsg = {
      id: Date.now(),
      message: messageText,
      isUser: true,
      timestamp: getTimestamp(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const response = await sendChat({ message: messageText })
      setIsTyping(false)
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          message: response.response || response.message || generateMockResponse(messageText),
          isUser: false,
          timestamp: getTimestamp(),
        },
      ])
    } catch {
      // Simulate delay for mock response
      setTimeout(() => {
        setIsTyping(false)
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            message: generateMockResponse(messageText),
            isUser: false,
            timestamp: getTimestamp(),
          },
        ])
      }, 1200)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className="animate-fade-in flex flex-col"
      style={{ height: 'calc(100vh - 8rem)' }}
    >
      {/* Chat Messages */}
      <div
        className="flex-1 overflow-y-auto rounded-2xl p-4 space-y-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
        }}
      >
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg.message}
            isUser={msg.isUser}
            timestamp={msg.timestamp}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div
              className="chat-bubble-ai px-5 py-3"
            >
              <p
                className="text-[10px] font-semibold mb-1 uppercase tracking-wider"
                style={{ color: 'var(--color-primary)' }}
              >
                AI Coach
              </p>
              <div className="typing-indicator flex items-center gap-1 py-1">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions (Bottom of Chat - Swiggy/Paytm Menu Style) */}
      <div className="flex flex-col gap-2 mt-4 mb-2 max-h-52 overflow-y-auto pr-1">
        {quickSuggestions.map((suggestion) => (
          <button
            key={suggestion.text}
            onClick={() => handleSend(suggestion.text)}
            className="text-sm md:text-base font-semibold py-3.5 px-5 rounded-xl transition-all duration-200 hover:scale-[1.005] active:scale-95 border text-left flex items-center justify-between cursor-pointer group"
            style={{
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border-color)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.45)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-input)'
              e.currentTarget.style.borderColor = 'var(--border-color)'
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg md:text-xl">{suggestion.emoji}</span>
              <span>{suggestion.text}</span>
            </div>
            <span className="text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs md:text-sm">➔</span>
          </button>
        ))}
      </div>

      {/* Input Bar (YouTube search bar style) */}
      <div
        className="flex items-center rounded-full overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-violet-500/20"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your AI coach anything..."
          className="flex-1 bg-transparent outline-none py-3.5 px-6 text-sm md:text-base font-medium"
          style={{ color: 'var(--text-primary)' }}
        />
        
        {/* Divider line */}
        <div className="h-8 w-[1px] bg-slate-700/40" />
        
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="flex items-center justify-center py-3.5 px-7 transition-all duration-200 disabled:opacity-30 h-full cursor-pointer hover:bg-slate-800/25"
          style={{
            color: input.trim() ? '#8B5CF6' : 'var(--text-muted)',
          }}
        >
          <HiPaperAirplane className="text-xl rotate-90 transition-transform duration-300 hover:scale-110 active:scale-95" />
        </button>
      </div>
    </div>
  )
}
