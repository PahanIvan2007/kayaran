// Feature 2: Match countdown timer
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Clock } from 'lucide-react'

interface Props { onTick?: (seconds: number) => void }

export default function MatchTimer({ onTick }: Props) {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => { onTick?.(s + 1); return s + 1 })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  const reset = () => { setRunning(false); setSeconds(0) }

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  return (
    <div className="glass-card p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Clock className="w-4 h-4 text-[#a78bfa]" />
        <span className="text-2xl font-mono font-bold tabular-nums text-[#e2e8f0]">
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
      </div>
      <div className="flex gap-1">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setRunning(!running)}
          className={`p-2 rounded-lg text-xs transition-colors ${running ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}
        >{running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={reset}
          className="p-2 rounded-lg bg-[#2a2a3a]/50 text-[#64748b] hover:text-[#e2e8f0] transition-colors"
        ><RotateCcw className="w-4 h-4" /></motion.button>
      </div>
    </div>
  )
}
