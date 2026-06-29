import { useState, useEffect, useRef } from 'react'
import { HiEye, HiTrendingUp, HiShieldCheck, HiRefresh, HiStar, HiCamera, HiCheckCircle } from 'react-icons/hi'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts'
import StatCard from '../components/StatCard'
import ChartCard from '../components/ChartCard'
import { useMediaPipe } from '../hooks/useMediaPipe'
import { drawLandmarks, drawConnections } from '../utils/poseMath'

const mockWeeklyPerformance = [
  { day: 'Mon', efficiency: 78, accuracy: 85, score: 82 },
  { day: 'Tue', efficiency: 82, accuracy: 88, score: 85 },
  { day: 'Wed', efficiency: 75, accuracy: 82, score: 79 },
  { day: 'Thu', efficiency: 88, accuracy: 92, score: 90 },
  { day: 'Fri', efficiency: 85, accuracy: 90, score: 88 },
  { day: 'Sat', efficiency: 92, accuracy: 95, score: 93 },
  { day: 'Sun', efficiency: 80, accuracy: 86, score: 83 },
]

const mockRadarData = [
  { exercise: 'Squats', score: 88 },
  { exercise: 'Push-ups', score: 92 },
  { exercise: 'Lunges', score: 75 },
  { exercise: 'Planks', score: 95 },
  { exercise: 'Deadlifts', score: 82 },
  { exercise: 'Curls', score: 90 },
]

const mockTimeline = [
  { date: 'Week 1', milestone: 'Started tracking', detail: 'First session with AI pose detection', icon: '🎯' },
  { date: 'Week 2', milestone: 'Form improved', detail: 'Squat depth increased by 15%', icon: '📈' },
  { date: 'Week 3', milestone: 'Consistency up', detail: '5/7 days of tracked workouts', icon: '🔥' },
  { date: 'Week 4', milestone: 'Personal best', detail: '95% form accuracy on push-ups', icon: '🏆' },
]

export default function PoseAnalyzer() {
  const { isLoaded } = useMediaPipe()
  const [isActive, setIsActive] = useState(false)
  const [calibrated, setCalibrated] = useState(false)
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const cameraRef = useRef(null)
  const poseRef = useRef(null)

  useEffect(() => {
    if (!isActive || !isLoaded || !videoRef.current || !canvasRef.current) return;

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');

    const pose = new window.Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults((results) => {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

      if (results.poseLandmarks) {
        drawConnections(canvasCtx, results.poseLandmarks);
        drawLandmarks(canvasCtx, results.poseLandmarks);
        setCalibrated(true);
      } else {
        setCalibrated(false);
      }
      canvasCtx.restore();
    });

    poseRef.current = pose;

    const camera = new window.Camera(videoElement, {
      onFrame: async () => {
        if (poseRef.current) {
           await poseRef.current.send({ image: videoElement });
        }
      },
      width: 1280,
      height: 720
    });

    camera.start().catch(err => console.error("Error starting camera:", err));
    cameraRef.current = camera;

    return () => {
      if (cameraRef.current) cameraRef.current.stop();
      if (poseRef.current) poseRef.current.close();
    };
  }, [isActive, isLoaded]);

  return (
    <div className="animate-fade-in space-y-6">
      {isActive ? (
        /* Immersive Camera / Calibration Mode */
        <div className="space-y-6">
          <div
            className="glass-card p-0 overflow-hidden relative flex items-center justify-center bg-black rounded-2xl border border-violet-500/20 shadow-2xl"
            style={{ minHeight: '480px', width: '100%' }}
          >
            <video ref={videoRef} style={{ display: 'none' }} playsInline />
            <canvas
              ref={canvasRef}
              width="1280"
              height="720"
              style={{ 
                  width: '100%', 
                  height: '100%', 
                  maxHeight: '480px',
                  objectFit: 'cover',
                  transform: 'scaleX(-1)'
              }}
            />
            
            {/* HUD / Calibration Overlays */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
               <div className="glass-card p-2 px-4 rounded-full" style={{ background: 'rgba(0,0,0,0.6)', border: 'none' }}>
                   <p className="text-white font-bold text-sm">
                     Status: <span style={{ color: calibrated ? '#10B981' : '#F59E0B' }}>
                       {calibrated ? 'Full Body Detected! Ready.' : 'Calibrating... Ensure full body is in frame.'}
                     </span>
                   </p>
               </div>
            </div>
          </div>
          
          {/* Calibration Wizard Control Panel */}
          <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6" style={{ background: 'var(--bg-card)' }}>
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Active Pose Calibration
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Please stand 6-8 feet away from the camera. The skeleton tracker will overlay your joints when your body is fully detected.
              </p>
            </div>
            
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white bg-green-500">1</div>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>AI Loaded</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white bg-green-500">2</div>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Camera Active</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${calibrated ? 'bg-green-500' : 'bg-gray-500'}`}>3</div>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Body Detected</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsActive(false)}
              className="py-3 px-6 rounded-xl font-semibold text-white transition-all hover:scale-105 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}
            >
              Stop Calibration
            </button>
          </div>
        </div>
      ) : (
        /* Dashboard Mode with Wide/Short Inactive Camera */
        <div className="space-y-6 animate-fade-in">
          {/* Inactive Camera Preview Card - Wide and Short */}
          <div
            className="glass-card p-0 overflow-hidden relative flex items-center justify-center bg-black border border-dashed border-violet-500/30"
            style={{ height: '180px', width: '100%' }}
          >
            <div className="text-center p-4">
              <HiCamera className="text-4xl mb-2 mx-auto animate-pulse" style={{ color: '#8B5CF6' }} />
              <p className="text-sm font-semibold text-white">Camera is inactive</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Expand camera to start pose calibration</p>
            </div>
          </div>
          
          {/* Wizard Instructions Card */}
          <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6" style={{ background: 'var(--bg-card)' }}>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Pose Calibration Wizard
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Ensure your full body is visible in the frame for accurate form tracking during workouts.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${isLoaded ? 'bg-green-500' : 'bg-gray-500'}`}>1</div>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>AI Loaded</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${isActive ? 'bg-green-500' : 'bg-gray-500'}`}>2</div>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Camera Active</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${calibrated ? 'bg-green-500' : 'bg-gray-500'}`}>3</div>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Body Detected</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsActive(true)}
              disabled={!isLoaded}
              className="btn-primary py-3 px-6 font-semibold disabled:opacity-50 flex-shrink-0"
            >
              Start Calibration
            </button>
          </div>
          
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            <StatCard icon={HiTrendingUp} title="Workout Efficiency" value="85%" subtitle="Above average" trend="up" color="violet" />
            <StatCard icon={HiShieldCheck} title="Form Accuracy" value="92%" subtitle="Excellent form" trend="up" color="cyan" />
            <StatCard icon={HiRefresh} title="Consistency" value="78%" subtitle="5/7 days active" trend="up" color="emerald" />
            <StatCard icon={HiStar} title="Overall Score" value="88%" subtitle="Top performer" trend="up" color="amber" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Line Chart */}
            <ChartCard title="Weekly Performance" subtitle="Efficiency, accuracy & overall score">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={mockWeeklyPerformance} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} domain={[60, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Line type="monotone" dataKey="efficiency" stroke="#06B6D4" strokeWidth={2.5} dot={{ fill: '#06B6D4', r: 4 }} name="Efficiency" />
                  <Line type="monotone" dataKey="accuracy" stroke="#0ea5e9" strokeWidth={2.5} dot={{ fill: '#0ea5e9', r: 4 }} name="Accuracy" />
                  <Line type="monotone" dataKey="score" stroke="#14B8A6" strokeWidth={2.5} dot={{ fill: '#14B8A6', r: 4 }} name="Overall" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Exercise Breakdown Radar */}
            <ChartCard title="Exercise Breakdown" subtitle="Form accuracy per exercise">
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={mockRadarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="var(--border-color)" />
                  <PolarAngleAxis dataKey="exercise" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#06B6D4"
                    fill="#06B6D4"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Progress Timeline */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
              📅 Progress Timeline
            </h3>
            <div className="relative">
              {/* Vertical line */}
              <div
                className="absolute left-5 top-0 bottom-0 w-0.5"
                style={{ backgroundColor: 'var(--border-color)' }}
              />

              <div className="space-y-6">
                {mockTimeline.map((item, i) => (
                  <div key={i} className="flex gap-4 items-start relative">
                    {/* Dot */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10 text-lg"
                      style={{
                        backgroundColor: 'var(--bg-input)',
                        border: '2px solid var(--border-color-hover)',
                      }}
                    >
                      {item.icon}
                    </div>

                    {/* Content */}
                    <div className="pb-2">
                      <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>
                        {item.date}
                      </p>
                      <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        {item.milestone}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
