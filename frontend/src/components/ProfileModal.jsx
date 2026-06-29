import { useState, useEffect } from 'react'
import { HiX, HiUser, HiSave, HiLogout } from 'react-icons/hi'
import { useToastContext } from './Toast'

export default function ProfileModal({ isOpen, onClose, profile, onSave, onLogout }) {
  const { addToast } = useToastContext()
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    activityLevel: 'Moderately Active',
    dailyWaterGoal: 8,
    dailySleepGoal: 8,
    dailyStepsGoal: 10000,
  })

  // Sync form data with profile prop when modal opens
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || 'Venky Athlete',
        age: profile.age || 24,
        gender: profile.gender || 'male',
        height: profile.height || 180,
        weight: profile.weight || 75,
        activityLevel: profile.activityLevel || 'Moderately Active',
        dailyWaterGoal: profile.dailyWaterGoal || 8,
        dailySleepGoal: profile.dailySleepGoal || 8,
        dailyStepsGoal: profile.dailyStepsGoal || 10000,
      })
    }
  }, [profile, isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ['age', 'height', 'weight', 'dailyWaterGoal', 'dailySleepGoal', 'dailyStepsGoal'].includes(name)
        ? value === '' ? '' : Number(value)
        : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      addToast('Name cannot be empty', 'error')
      return
    }
    if (formData.age <= 0 || formData.height <= 0 || formData.weight <= 0) {
      addToast('Please enter valid age, height, and weight values', 'error')
      return
    }
    onSave(formData)
    addToast('Profile saved successfully!', 'success')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container Form */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl animate-scale-in max-h-[90vh] flex flex-col"
        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
              <HiUser className="text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Edit Profile</h3>
              <p className="text-sm text-slate-400">Update your physical stats and fitness goals</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl border border-slate-700/60 text-slate-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <HiX className="text-xl" />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {/* Physical Stats Section */}
          <div className="space-y-5">
            <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Physical Profile</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full text-base py-3 px-4 bg-[#050D12] border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:outline-none transition-all"
                  placeholder="Enter name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full text-base py-3 px-4 bg-[#050D12] border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:outline-none transition-all"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Age (years)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full text-base py-3 px-4 bg-[#050D12] border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:outline-none transition-all"
                  placeholder="e.g. 24"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Activity Level</label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="w-full text-base py-3 px-4 bg-[#050D12] border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:outline-none transition-all"
                >
                  <option value="Sedentary">Sedentary (little to no exercise)</option>
                  <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
                  <option value="Moderately Active">Moderately Active (3-5 days/week)</option>
                  <option value="Very Active">Very Active (6-7 days/week)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full text-base py-3 px-4 bg-[#050D12] border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:outline-none transition-all"
                  placeholder="e.g. 180"
                  min="30"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full text-base py-3 px-4 bg-[#050D12] border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:outline-none transition-all"
                  placeholder="e.g. 75"
                  min="20"
                  required
                />
              </div>
            </div>
          </div>

          <hr className="border-[var(--border-color)]" />

          {/* Daily Goals Section */}
          <div className="space-y-5">
            <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Daily Health Goals</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Water (glasses)</label>
                <input
                  type="number"
                  name="dailyWaterGoal"
                  value={formData.dailyWaterGoal}
                  onChange={handleChange}
                  className="w-full text-base py-3 px-4 bg-[#050D12] border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:outline-none transition-all"
                  placeholder="e.g. 8"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Sleep (hours)</label>
                <input
                  type="number"
                  name="dailySleepGoal"
                  value={formData.dailySleepGoal}
                  onChange={handleChange}
                  className="w-full text-base py-3 px-4 bg-[#050D12] border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:outline-none transition-all"
                  placeholder="e.g. 8"
                  min="1"
                  max="24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Steps</label>
                <input
                  type="number"
                  name="dailyStepsGoal"
                  value={formData.dailyStepsGoal}
                  onChange={handleChange}
                  className="w-full text-base py-3 px-4 bg-[#050D12] border border-slate-800 rounded-xl text-white focus:border-cyan-500 focus:outline-none transition-all"
                  placeholder="e.g. 10000"
                  min="100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer Buttons */}
        <div className="flex items-center justify-end gap-4 p-6 md:p-8 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#A31D1D] hover:bg-[#881818] shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <HiLogout className="text-lg" />
            Logout
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-sm font-semibold border border-slate-700 text-slate-200 bg-[#0F172A]/40 hover:bg-[#0F172A]/80 hover:text-white transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#06B6D4] hover:bg-[#0891B2] shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <HiSave className="text-lg" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
