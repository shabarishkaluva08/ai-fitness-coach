import { useState, useEffect } from 'react'
import { HiCalculator, HiSparkles, HiCheckCircle, HiShoppingCart } from 'react-icons/hi'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToastContext } from '../components/Toast'
import { useUserContext } from '../components/Layout'
import { calculateBMI, generateDietPlan } from '../services/api'

const mockMealPlan = {
  breakfast: {
    title: '🌅 Breakfast',
    items: ['Oatmeal with berries & almonds', 'Greek yogurt parfait', 'Green smoothie'],
    calories: 450,
    protein: '25g',
    carbs: '55g',
    fat: '12g',
  },
  lunch: {
    title: '☀️ Lunch',
    items: ['Grilled chicken Caesar salad', 'Quinoa bowl with vegetables', 'Whole grain bread'],
    calories: 620,
    protein: '42g',
    carbs: '58g',
    fat: '18g',
  },
  dinner: {
    title: '🌙 Dinner',
    items: ['Baked salmon with asparagus', 'Brown rice pilaf', 'Mixed green salad'],
    calories: 580,
    protein: '38g',
    carbs: '45g',
    fat: '22g',
  },
  snacks: {
    title: '🍎 Snacks',
    items: ['Apple with peanut butter', 'Trail mix (30g)', 'Protein shake'],
    calories: 350,
    protein: '20g',
    carbs: '35g',
    fat: '14g',
  },
}

const mockGroceryList = [
  'Oats (500g)', 'Mixed berries', 'Greek yogurt', 'Almonds',
  'Chicken breast (500g)', 'Quinoa', 'Salmon fillets (400g)',
  'Brown rice', 'Asparagus', 'Mixed greens', 'Peanut butter',
  'Whey protein powder', 'Bananas', 'Eggs (12 pack)',
]

export default function DietCoach() {
  const { addToast } = useToastContext()
  const { profile } = useUserContext()
  const [form, setForm] = useState({
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    goal: 'maintain',
    preference: 'balanced',
  })

  // Prepopulate stats from profile when page loads or profile changes
  useEffect(() => {
    if (profile) {
      setForm(prev => ({
        ...prev,
        age: profile.age ? profile.age.toString() : prev.age,
        gender: profile.gender || prev.gender,
        height: profile.height ? profile.height.toString() : prev.height,
        weight: profile.weight ? profile.weight.toString() : prev.weight,
      }))
    }
  }, [profile])
  const [bmiResult, setBmiResult] = useState(null)
  const [mealPlan, setMealPlan] = useState(null)
  const [groceryChecked, setGroceryChecked] = useState({})
  const [loading, setLoading] = useState(false)
  const [mealLoading, setMealLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleBMI = async () => {
    if (!form.age || !form.height || !form.weight) {
      addToast('Please fill in all fields', 'error')
      return
    }

    setLoading(true)
    try {
      const result = await calculateBMI({
        age: parseInt(form.age),
        gender: form.gender,
        height: parseFloat(form.height),
        weight: parseFloat(form.weight),
        goal: form.goal,
      })
      setBmiResult(result)
      addToast('BMI calculated successfully!', 'success')
    } catch {
      // Calculate locally as fallback
      const heightM = parseFloat(form.height) / 100
      const bmi = (parseFloat(form.weight) / (heightM * heightM)).toFixed(1)
      let category = 'Normal'
      let color = '#10B981'
      if (bmi < 18.5) { category = 'Underweight'; color = '#06B6D4' }
      else if (bmi < 25) { category = 'Normal'; color = '#10B981' }
      else if (bmi < 30) { category = 'Overweight'; color = '#F59E0B' }
      else { category = 'Obese'; color = '#EF4444' }

      const bmr = form.gender === 'male'
        ? 10 * parseFloat(form.weight) + 6.25 * parseFloat(form.height) - 5 * parseInt(form.age) + 5
        : 10 * parseFloat(form.weight) + 6.25 * parseFloat(form.height) - 5 * parseInt(form.age) - 161

      let multiplier = 1.55
      if (form.goal === 'lose') multiplier = 1.3
      else if (form.goal === 'gain') multiplier = 1.75

      setBmiResult({
        bmi: parseFloat(bmi),
        category,
        color,
        daily_calories: Math.round(bmr * multiplier),
        bmr: Math.round(bmr),
      })
      addToast('BMI calculated (offline mode)', 'info')
    } finally {
      setLoading(false)
    }
  }

  const handleGeneratePlan = async () => {
    setMealLoading(true)
    try {
      const result = await generateDietPlan({
        ...form,
        bmi: bmiResult?.bmi,
        daily_calories: bmiResult?.daily_calories,
      })
      setMealPlan(result.meal_plan || mockMealPlan)
    } catch {
      setMealPlan(mockMealPlan)
      addToast('Using sample meal plan (offline mode)', 'info')
    } finally {
      setMealLoading(false)
    }
  }

  const toggleGrocery = (item) => {
    setGroceryChecked(prev => ({ ...prev, [item]: !prev[item] }))
  }

  const getBmiGaugePercent = (bmi) => {
    // Map BMI 10-40 to 0-100%
    return Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100))
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Profile Form */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Your Profile
        </h3>
        <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
          Enter your details for personalized nutrition guidance
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
              Age
            </label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="25"
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
              Gender
            </label>
            <select name="gender" value={form.gender} onChange={handleChange} className="select-field">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
              Height (cm)
            </label>
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={handleChange}
              placeholder="175"
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              placeholder="70"
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
              Goal
            </label>
            <select name="goal" value={form.goal} onChange={handleChange} className="select-field">
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Gain Weight</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
              Dietary Preference
            </label>
            <select name="preference" value={form.preference} onChange={handleChange} className="select-field">
              <option value="balanced">Balanced</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleBMI}
          disabled={loading}
          className="btn-primary mt-5"
        >
          <HiCalculator />
          {loading ? 'Calculating...' : 'Calculate BMI'}
        </button>
      </div>

      {/* BMI Result */}
      {bmiResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
          {/* BMI Card */}
          <div className="glass-card p-6 text-center">
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
              Your BMI Result
            </h3>

            <div className="mb-4">
              <p
                className="text-5xl font-black mb-2"
                style={{ color: bmiResult.color }}
              >
                {bmiResult.bmi}
              </p>
              <span
                className="text-sm font-semibold px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: `${bmiResult.color}20`,
                  color: bmiResult.color,
                }}
              >
                {bmiResult.category}
              </span>
            </div>

            {/* Visual gauge */}
            <div className="mt-6 px-4">
              <div
                className="h-3 rounded-full relative overflow-hidden"
                style={{ backgroundColor: 'var(--bg-input)' }}
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
                  style={{
                    width: `${getBmiGaugePercent(bmiResult.bmi)}%`,
                    background: `linear-gradient(90deg, #06B6D4, #10B981, #F59E0B, #EF4444)`,
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-1000"
                  style={{
                    left: `calc(${getBmiGaugePercent(bmiResult.bmi)}% - 8px)`,
                    backgroundColor: bmiResult.color,
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
            </div>
          </div>

          {/* Calorie Card */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
              Daily Nutrition Target
            </h3>

            <div className="text-center mb-4">
              <p className="text-4xl font-black" style={{ color: 'var(--color-primary)' }}>
                {bmiResult.daily_calories?.toLocaleString()}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>calories / day</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: 'Protein', value: `${Math.round(bmiResult.daily_calories * 0.3 / 4)}g`, color: '#8B5CF6' },
                { label: 'Carbs', value: `${Math.round(bmiResult.daily_calories * 0.45 / 4)}g`, color: '#06B6D4' },
                { label: 'Fat', value: `${Math.round(bmiResult.daily_calories * 0.25 / 9)}g`, color: '#10B981' },
              ].map((macro) => (
                <div
                  key={macro.label}
                  className="text-center p-3 rounded-xl"
                  style={{ backgroundColor: 'var(--bg-input)' }}
                >
                  <p className="text-lg font-bold" style={{ color: macro.color }}>{macro.value}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{macro.label}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={mealLoading}
              className="btn-primary w-full mt-5 justify-center"
            >
              <HiSparkles />
              {mealLoading ? 'Generating Plan...' : 'Generate AI Meal Plan'}
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {mealLoading && <LoadingSpinner text="AI is creating your personalized meal plan..." />}

      {/* Meal Plan */}
      {mealPlan && !mealLoading && (
        <div className="animate-slide-up">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            <HiSparkles className="inline mr-2" style={{ color: 'var(--color-primary)' }} />
            Your AI Meal Plan
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
            {Object.values(mealPlan).map((meal, idx) => (
              <div key={idx} className="glass-card p-5">
                <h4 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  {meal.title}
                </h4>

                <div className="space-y-2 mb-4">
                  {meal.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      />
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</p>
                    </div>
                  ))}
                </div>

                <div
                  className="flex items-center justify-between pt-3 text-xs"
                  style={{ borderTop: '1px solid var(--border-color)' }}
                >
                  <span className="font-bold" style={{ color: 'var(--color-primary)' }}>
                    {meal.calories} kcal
                  </span>
                  <div className="flex gap-3" style={{ color: 'var(--text-muted)' }}>
                    <span>P: {meal.protein}</span>
                    <span>C: {meal.carbs}</span>
                    <span>F: {meal.fat}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grocery List */}
      {mealPlan && !mealLoading && (
        <div className="glass-card p-5 animate-slide-up">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <HiShoppingCart style={{ color: 'var(--color-cyan)' }} />
            Grocery List
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {mockGroceryList.map((item, i) => (
              <label
                key={i}
                className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors"
                style={{ backgroundColor: groceryChecked[item] ? 'var(--bg-input)' : 'transparent' }}
              >
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all cursor-pointer"
                  style={{
                    backgroundColor: groceryChecked[item] ? 'var(--color-primary)' : 'transparent',
                    border: groceryChecked[item] ? 'none' : '2px solid var(--border-color-hover)',
                  }}
                  onClick={() => toggleGrocery(item)}
                >
                  {groceryChecked[item] && <HiCheckCircle className="text-white text-xs" />}
                </div>
                <span
                  className={`text-sm transition-all ${groceryChecked[item] ? 'line-through' : ''}`}
                  style={{ color: groceryChecked[item] ? 'var(--text-muted)' : 'var(--text-secondary)' }}
                >
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
