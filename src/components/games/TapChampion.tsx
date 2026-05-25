import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Trophy, RotateCcw } from 'lucide-react'

export default function TapChampion() {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('kayaran_tap_high') || 0))
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([])
  const [showResult, setShowResult] = useState(false)
  const pidRef = useRef(0)

  useEffect(() => {
    if (timeLeft <= 0 && playing) {
      setPlaying(false)
      setShowResult(true)
      if (score > highScore) {
        setHighScore(score)
        localStorage.setItem('kayaran_tap_high', String(score))
      }
      return
    }
    if (!playing) return
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, playing])

  const startGame = () => {
    setScore(0)
    setTimeLeft(15)
    setPlaying(true)
    setShowResult(false)
    setCombo(0)
    setMaxCombo(0)
    setParticles([])
  }

  const tap = useCallback(() => {
    if (!playing) return
    setScore(s => s + 1)
    setCombo(c => {
      const nc = c + 1
      if (nc > maxCombo) setMaxCombo(nc)
      return nc
    })
    const id = ++pidRef.current
    setParticles(p => [...p.slice(-8), { id, x: 40 + Math.random() * 20, y: 20 + Math.random() * 40 }])
    setTimeout(() => setParticles(p => p.filter(pt => pt.id !== id)), 600)
  }, [playing, maxCombo])

  useEffect(() => {
    if (!playing) return
    const handler = (e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); tap() } }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [playing, tap])

  return (
    <div className="glass-card p-6 text-center select-none" onClick={tap}>
      <div className="flex items-center justify-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-[#a78bfa]" />
        <span className="text-sm text-[#64748b] tracking-[0.15em] uppercase">Tap Champion</span>
      </div>

      {!playing && !showResult ? (
        <div className="py-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
            <Zap className="w-10 h-10 text-white" />
          </div>
          <p className="text-lg font-bold text-gradient mb-2">Tap Champion</p>
          <p className="text-xs text-[#64748b] mb-1">Тапай как можно быстрее за 15 секунд</p>
          <p className="text-xs text-[#475569] mb-6">Рекорд: {highScore} тапов</p>
          <button onClick={e => { e.stopPropagation(); startGame() }} className="btn-primary text-base px-8 py-4">
            <Zap className="w-5 h-5" />ИГРАТЬ!
          </button>
        </div>
      ) : playing ? (
        <div className="relative">
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-5xl font-black text-[#a78bfa] tabular-nums">{score}</p>
              <p className="text-[10px] text-[#475569] uppercase tracking-wider mt-1">Тапов</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-black text-[#f59e0b] tabular-nums">{timeLeft}</p>
              <p className="text-[10px] text-[#475569] uppercase tracking-wider mt-1">Сек</p>
            </div>
          </div>

          {combo >= 5 && (
            <motion.div key={combo} initial={{ scale: 0, opacity: 1 }} animate={{ scale: 2, opacity: 0 }} className="text-3xl font-black text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              x{combo}
            </motion.div>
          )}

          <AnimatePresence>
            {particles.map(p => (
              <motion.div key={p.id} initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -60 }} exit={{ opacity: 0 }}
                className="absolute text-lg pointer-events-none" style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >⚡</motion.div>
            ))}
          </AnimatePresence>

          <div className="w-full bg-[#1a1a25] rounded-full h-2 mb-4 overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] rounded-full" style={{ width: `${(timeLeft / 15) * 100}%` }} />
          </div>

          <p className="text-[10px] text-[#475569]">Тапай / Пробел</p>
        </div>
      ) : (
        <div className="py-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-emerald-500/20 border border-emerald-500/30">
            <Trophy className="w-10 h-10 text-emerald-400" />
          </div>
          <p className="text-4xl font-black text-[#a78bfa] tabular-nums mb-1">{score}</p>
          <p className="text-xs text-[#64748b] mb-1">тапов за 15 секунд</p>
          <p className="text-xs text-[#475569] mb-1">Макс комбо: {maxCombo}</p>
          <p className="text-xs text-[#475569] mb-6">Скорость: {(score / 15).toFixed(1)} тапов/с</p>
          {score >= highScore && score > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-lg mb-4">🏆 НОВЫЙ РЕКОРД!</motion.div>
          )}
          <button onClick={e => { e.stopPropagation(); startGame() }} className="btn-primary">
            <RotateCcw className="w-4 h-4" />Ещё раз
          </button>
        </div>
      )}
    </div>
  )
}
