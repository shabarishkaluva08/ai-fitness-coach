import { useState } from 'react'
import { HiSearch, HiLocationMarker, HiStar, HiCurrencyDollar, HiPhone, HiExternalLink, HiX, HiClock, HiCheckCircle } from 'react-icons/hi'
import { useToastContext } from '../components/Toast'

const mockGyms = [
  {
    id: 1,
    name: 'Iron Paradise Fitness',
    rating: 4.8,
    reviews: 342,
    distance: '0.8 km',
    address: '123 Main Street, Downtown',
    phone: '+1 (555) 123-4567',
    price: '$$',
    specialties: ['Weight Training', 'CrossFit', 'Personal Training'],
    hours: '5:00 AM - 11:00 PM',
    image: '🏋️',
    description: 'Iron Paradise Fitness is a premium hardcore lifting gym and CrossFit box. We offer state-of-the-art strength equipment, power racks, specialized training zones, and certified personal trainers to help you crush your limits.',
    amenities: ['Heavy Weight Zone', 'CrossFit Area', 'Locker Rooms', 'Showers', 'Protein Shake Bar', 'Free Parking'],
    reviewsList: [
      { name: 'Sarah K.', rating: 5, comment: 'Best lifting gym in town! The equipment is top-notch and the community is super supportive.' },
      { name: 'Marcus L.', rating: 4, comment: 'Great trainers and plenty of squat racks. Can get a bit busy around 6 PM.' }
    ]
  },
  {
    id: 2,
    name: 'ZenFit Yoga Studio',
    rating: 4.9,
    reviews: 218,
    distance: '1.2 km',
    address: '456 Oak Avenue, Midtown',
    phone: '+1 (555) 234-5678',
    price: '$$$',
    specialties: ['Yoga', 'Meditation', 'Pilates'],
    hours: '6:00 AM - 9:00 PM',
    image: '🧘',
    description: 'ZenFit is your urban sanctuary for yoga, pilates, and mindfulness. Our light-filled studios, warm flooring, and certified instructors provide the perfect environment to restore balance, flexibility, and inner peace.',
    amenities: ['Yoga Mats Provided', 'Meditation Room', 'Infrared Heated Studio', 'Showers', 'Organic Tea Lounge', 'Filtered Water Station'],
    reviewsList: [
      { name: 'Emily R.', rating: 5, comment: 'Such a peaceful environment. The teachers are highly skilled and take time to guide beginners.' },
      { name: 'David M.', rating: 5, comment: 'Excellent Pilates classes! Clean facility and calm vibe.' }
    ]
  },
  {
    id: 3,
    name: 'PowerUp CrossFit Box',
    rating: 4.7,
    reviews: 189,
    distance: '1.5 km',
    address: '789 Pine Road, Eastside',
    phone: '+1 (555) 345-6789',
    price: '$$',
    specialties: ['CrossFit', 'HIIT', 'Olympic Lifting'],
    hours: '5:30 AM - 10:00 PM',
    image: '💪',
    description: 'PowerUp is a certified CrossFit affiliate specializing in high-intensity functional training, Olympic weightlifting, and metabolic conditioning. We offer group classes led by expert coaches who focus on form and safety.',
    amenities: ['Rogue CrossFit Rigs', 'Olympic Lifting Platforms', 'Chalk Stations', 'Showers', 'Community Events', 'Mobility Tools'],
    reviewsList: [
      { name: 'Chris T.', rating: 5, comment: 'High energy, great coaching, and extremely friendly community. Recommending this to everyone!' },
      { name: 'Jessica W.', rating: 4, comment: 'Intense workouts but coaches offer scales for all levels. Love the training format.' }
    ]
  },
  {
    id: 4,
    name: 'AquaFit Swimming Center',
    rating: 4.6,
    reviews: 156,
    distance: '2.1 km',
    address: '321 River Lane, Westside',
    phone: '+1 (555) 456-7890',
    price: '$',
    specialties: ['Swimming', 'Aqua Aerobics', 'Cardio'],
    hours: '6:00 AM - 10:00 PM',
    image: '🏊',
    description: 'AquaFit features an indoor heated Olympic-size swimming pool, water aerobics classes, and dedicated lap lanes. Our facility caters to recreational swimmers, training athletes, and aqua-cardio enthusiasts of all ages.',
    amenities: ['Heated 50m Pool', 'Locker Rooms & Saunas', 'Swim Gear Shop', 'Showers & Blow Dryers', 'Cafe & Viewing Deck', 'Lifeguard on Duty'],
    reviewsList: [
      { name: 'Robert G.', rating: 4, comment: 'Great pool lanes, usually not too crowded in the mornings. Water is clean and temperature is perfect.' },
      { name: 'Elena P.', rating: 5, comment: 'Aqua aerobics here is amazing! Energetic teachers and clean lockers.' }
    ]
  },
  {
    id: 5,
    name: 'Elite Performance Gym',
    rating: 4.9,
    reviews: 420,
    distance: '2.8 km',
    address: '555 Park Boulevard, Uptown',
    phone: '+1 (555) 567-8901',
    price: '$$$',
    specialties: ['Muscle Building', 'Personal Training', 'Nutrition'],
    hours: '24/7',
    image: '🔥',
    description: 'Elite Performance is a state-of-the-art facility operating 24/7. We offer premium gym equipment, a dedicated turf zone, expert nutrition consulting, and custom physical therapy assessments to ensure peak performance.',
    amenities: ['24/7 Access', 'Sled & Turf Track', 'Nutrition Bar', 'Sauna & Steam Rooms', 'Physiotherapy Clinic', 'Towel Service'],
    reviewsList: [
      { name: 'Vikram S.', rating: 5, comment: 'The 24/7 access is perfect for my schedule. High-tech machines and awesome shake menu!' },
      { name: 'Rohan D.', rating: 5, comment: 'Absolutely elite! Personal trainers are extremely knowledgeable and custom meal plans are effective.' }
    ]
  },
  {
    id: 6,
    name: 'FitZone Community Gym',
    rating: 4.5,
    reviews: 298,
    distance: '3.2 km',
    address: '888 Community Drive, Suburbs',
    phone: '+1 (555) 678-9012',
    price: '$',
    specialties: ['General Fitness', 'Group Classes', 'Cardio'],
    hours: '6:00 AM - 11:00 PM',
    image: '🏃',
    description: 'FitZone is an all-inclusive family-friendly community gym. We offer cardio sections, resistance training machines, group classes, spin studios, and child care to make your fitness journey convenient and enjoyable.',
    amenities: ['Cardio Cinema', 'Group Class Studio', 'Spin Room', 'Locker Rooms', 'Kids Club Child Care', 'Free Wi-Fi'],
    reviewsList: [
      { name: 'Priya M.', rating: 4, comment: 'Good community gym. Affordable membership and friendly staff. Love the spin classes!' },
      { name: 'Anil K.', rating: 5, comment: 'Lots of cardio machines and the group fitness schedules are very diverse.' }
    ]
  },
]

const fitnessGoals = [
  'Weight Loss',
  'Muscle Building',
  'Cardio & Endurance',
  'Yoga & Flexibility',
  'CrossFit',
  'Swimming',
]

function GymDetailsModal({ gym, onClose }) {
  const [booking, setBooking] = useState(false)
  const { addToast } = useToastContext()

  if (!gym) return null

  const handleBook = () => {
    setBooking(true)
    setTimeout(() => {
      addToast(`Free trial booked successfully for ${gym.name}! Check your email. ✉️`, 'success')
      setBooking(false)
      onClose()
    }, 1200)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    for (let i = 0; i < 5; i++) {
      stars.push(
        <HiStar
          key={i}
          className="text-sm"
          style={{ color: i < fullStars ? '#F59E0B' : 'var(--border-color)' }}
        />
      )
    }
    return stars
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl animate-scale-in max-h-[90vh] flex flex-col"
        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-cyan-500/10 text-cyan-400">
              {gym.image}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{gym.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex">{renderStars(gym.rating)}</div>
                <span className="text-xs font-semibold text-amber-500">{gym.rating}</span>
                <span className="text-xs text-slate-400">({gym.reviews} reviews)</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl border border-slate-700/60 text-slate-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <HiX className="text-xl" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">About the Gym</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{gym.description}</p>
          </div>

          {/* Specialties Badges */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Specialties</h4>
            <div className="flex flex-wrap gap-2">
              {gym.specialties.map((spec) => (
                <span
                  key={spec}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-500/10 text-[var(--color-primary)] border border-purple-500/20"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Info Grid (Address, Phone, Hours, Price) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[#050D12]/50 border border-slate-800">
            <div className="flex gap-3 text-sm">
              <HiLocationMarker className="text-xl text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Address</p>
                <p className="text-slate-400 text-xs mt-0.5">{gym.address}</p>
                <p className="text-slate-500 text-[10px] mt-0.5">Distance: {gym.distance}</p>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <HiPhone className="text-xl text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Phone</p>
                <p className="text-slate-400 text-xs mt-0.5">{gym.phone}</p>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <HiClock className="text-xl text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Operating Hours</p>
                <p className="text-slate-400 text-xs mt-0.5">{gym.hours}</p>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <HiCurrencyDollar className="text-xl text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Pricing Tier</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {gym.price === '$' && 'Budget Friendly ($)'}
                  {gym.price === '$$' && 'Mid-Range ($$)'}
                  {gym.price === '$$$' && 'Premium / Luxury ($$$)'}
                </p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Amenities</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {gym.amenities.map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-slate-300">
                  <HiCheckCircle className="text-emerald-500 text-base flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Member Reviews</h4>
            <div className="space-y-3">
              {gym.reviewsList.map((rev, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#050D12]/30 border border-slate-800/40 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{rev.name}</span>
                    <div className="flex">{renderStars(rev.rating)}</div>
                  </div>
                  <p className="text-slate-400 italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-700 text-slate-300 hover:bg-white/5 hover:text-white transition-all"
          >
            Close
          </button>
          <button
            type="button"
            disabled={booking}
            onClick={handleBook}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#06B6D4] hover:bg-[#0891B2] shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {booking ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                Book Free Trial
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function GymRecommender() {
  const [city, setCity] = useState('')
  const [goal, setGoal] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [selectedGym, setSelectedGym] = useState(null)

  const handleSearch = () => {
    setSearched(true)
    if (goal) {
      const filtered = mockGyms.filter(gym =>
        gym.specialties.some(s => s.toLowerCase().includes(goal.toLowerCase().split(' ')[0]))
      )
      setResults(filtered.length > 0 ? filtered : mockGyms)
    } else {
      setResults(mockGyms)
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    for (let i = 0; i < 5; i++) {
      stars.push(
        <HiStar
          key={i}
          className="text-sm"
          style={{ color: i < fullStars ? '#F59E0B' : 'var(--border-color)' }}
        />
      )
    }
    return stars
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Search Section */}
      <div
        className="glass-card p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(6,182,212,0.08))',
        }}
      >
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }}
        />

        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            <HiLocationMarker className="inline mr-2" style={{ color: 'var(--color-primary)' }} />
            Find Your Perfect Gym
          </h2>
          <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
            Search gyms near you based on your fitness goals
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                City / Location
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city..."
                className="input-field"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Fitness Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="select-field"
              >
                <option value="">All Goals</option>
                {fitnessGoals.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="btn-primary px-6 py-2.5 w-full sm:w-auto"
              >
                <HiSearch />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {results.length} Gyms Found
              {city && <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}> near {city}</span>}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {results.map((gym) => (
              <div key={gym.id} className="glass-card p-5 group">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: 'var(--bg-input)' }}
                  >
                    {gym.image}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                      {gym.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="flex">{renderStars(gym.rating)}</div>
                      <span className="text-xs font-semibold" style={{ color: '#F59E0B' }}>
                        {gym.rating}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        ({gym.reviews})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <HiLocationMarker className="flex-shrink-0" style={{ color: 'var(--color-cyan)' }} />
                    <span>{gym.address}</span>
                    <span
                      className="ml-auto font-semibold px-2 py-0.5 rounded-full text-[10px]"
                      style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        color: '#10B981',
                      }}
                    >
                      {gym.distance}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <HiPhone className="flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                    <span>{gym.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <HiCurrencyDollar className="flex-shrink-0" style={{ color: '#F59E0B' }} />
                    <span>{gym.price} · {gym.hours}</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {gym.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="text-[10px] font-medium px-2 py-1 rounded-lg"
                      style={{
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        color: 'var(--color-primary)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Action */}
                <button
                  onClick={() => setSelectedGym(gym)}
                  className="btn-secondary w-full justify-center text-xs"
                >
                  <HiExternalLink />
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!searched && (
        <div className="glass-card p-12 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'var(--bg-input)' }}
          >
            <HiLocationMarker className="text-3xl" style={{ color: 'var(--text-muted)' }} />
          </div>
          <p className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Ready to find your gym?
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Enter your city and fitness goal above to discover the best gyms near you.
          </p>
        </div>
      )}

      {/* Gym Details Modal */}
      {selectedGym && (
        <GymDetailsModal
          gym={selectedGym}
          onClose={() => setSelectedGym(null)}
        />
      )}
    </div>
  )
}
