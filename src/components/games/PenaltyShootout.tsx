import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Trophy, RotateCcw, Swords } from 'lucide-react'

const GOAL_WIDTH = 60
const SWEEP_DURATION = 1200

export default function PenaltyShootout() {
  const [phase, setPhase] = useState<'idle' | 'aiming' | 'result' | 'done'>('idle')
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [ballPos, setBallPos] = useState(50)
  const [result, setResult] = useState<'goal' | 'miss' | null>(null)
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('kayaran_penalty_high') || 0))
  const [targetZone, setTargetZone] = useState({ start: 0, end: 0 })
  const animRef = useRef<number>(0)
  const startTimeRef = useRef(0)
  const posRef = useRef(50)

  const startAiming = () => {
    setAttempts(0)
    setScore(0)
    setPhase('aiming')
    setResult(null)
    startNewShot()
  }

  const startNewShot = () => {
    const center = 15 + Math.random() * 40
    const width = 8 + Math.random() * 12
    setTargetZone({ start: center - width / 2, end: center + width / 2 })
    setBallPos(50)
    posRef.current = 50
    startTimeRef.current = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current
      const progress = (elapsed % SWEEP_DURATION) / SWEEP_DURATION
      const newPos = 15 + Math.sin(progress * Math.PI * 2) * 35
      posRef.current = 15 + Math.sin(progress * Math.PI * 2) * 35
      setBallPos(newPos)
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
  }

  const shoot = () => {
    if (phase !== 'aiming') return
    cancelAnimationFrame(animRef.current)

    const pos = posRef.current
    const isGoal = pos >= targetZone.start && pos <= targetZone.end

    setResult(isGoal ? 'goal' : 'miss')
    setPhase('result')
    if (isGoal) setScore(s => s + 1)
    setAttempts(a => a + 1)
  }

  useEffect(() => {
    if (phase !== 'aiming') return
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); shoot() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase])

  useEffect(() => {
    if (phase === 'aiming') {
      const handler = (e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); shoot() } }
      window.addEventListener('keydown', handler)
      return () => window.removeEventListener('keydown', handler)
    }
  }, [phase])

  const nextShot = () => {
    if (attempts >= 5) {
      if (score > highScore) {
        setHighScore(score)
        localStorage.setItem('kayaran_penalty_high', String(score))
      }
      setPhase('done')
      return
    }
    setResult(null)
    setPhase('aiming')
    startNewShot()
  }

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <div className="glass-card p-6 text-center select-none">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Target className="w-5 h-5 text-[#a78bfa]" />
        <span className="text-sm text-[#64748b] tracking-[0.15em] uppercase">Penalty Shootout</span>
      </div>

      {phase === 'idle' ? (
        <div className="py-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
            <Swords className="w-10 h-10 text-white" />
          </div>
          <p className="text-lg font-bold text-gradient mb-2">Penalty Shootout</p>
          <p className="text-xs text-[#64748b] mb-1">5 попыток — попади в створ!</p>
          <p className="text-xs text-[#475569] mb-6">Нажми Пробел в нужный момент</p>
          <button onClick={startAiming} className="btn-primary text-base px-8 py-4">
            <Swords className="w-5 h-5" />ИГРАТЬ!
          </button>
        </div>
      ) : phase === 'aiming' ? (
        <div className="py-4">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-center">
              <p className="text-3xl font-black text-[#a78bfa] tabular-nums">{score}</p>
              <p className="text-[10px] text-[#475569]">Голов</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-[#64748b] tabular-nums">{attempts}/5</p>
              <p className="text-[10px] text-[#475569]">Попыток</p>
            </div>
          </div>

          <div className="relative mx-auto mb-4" style={{ width: `${GOAL_WIDTH}%`, height: 120 }}>
            <div className="w-full h-full rounded-2xl border-4 border-white/20 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #1a1a25, #0a0a0f)' }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/10" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5" />
              <div className="absolute top-0 bottom-0 left-0 w-2 bg-white/15 rounded-l" />
              <div className="absolute top-0 bottom-0 right-0 w-2 bg-white/15 rounded-r" />

              <div className="absolute top-1/2 left-0 right-0 h-12 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center">
                    <div
                      className="absolute w-4 h-4 bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] rounded-full shadow-lg shadow-[#8b5cf6]/50 transition-all duration-75"
                      style={{ left: `${ballPos}%`, transform: 'translateX(-50%)' }}
                    />
                  </div>
                  <div className="absolute top-0 left-[15%] bottom-0 w-[70%] border-2 border-dashed border-emerald-500/20 rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${i < attempts ? (result === 'goal' ? 'bg-emerald-400' : 'bg-red-400') : 'bg-[#2a2a3a]'}`} />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shoot} className="btn-primary text-lg px-10 py-4"
          >
            <Target className="w-5 h-5" />УДАР!
          </motion.button>

          <p className="text-[10px] text-[#475569] mt-3">Пробел / кнопка</p>
        </div>
      ) : phase === 'result' ? (
        <div className="py-6">
          <AnimatePresence mode="wait">
            {result === 'goal' ? (
              <motion.div key="goal" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl mb-4">⚽</motion.div>
            ) : (
              <motion.div key="miss" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl mb-4">😱</motion.div>
            )}
          </AnimatePresence>
          <p className={`text-xl font-bold mb-2 ${result === 'goal' ? 'text-emerald-400' : 'text-red-400'}`}>
            {result === 'goal' ? 'ГОЛ!' : 'МИМО!'}
          </p>
          <p className="text-xs text-[#64748b] mb-4">Счёт: {score}/{attempts}</p>
          {attempts >= 5 ? (
            <button onClick={() => {
              if (score > highScore) {
                setHighScore(score)
                localStorage.setItem('kayaran_penalty_high', String(score))
              }
              setPhase('done')
            }} className="btn-primary">
              <Trophy className="w-4 h-4" />Результат
            </button>
          ) : (
            <button onClick={nextShot} className="btn-primary">
              <Target className="w-4 h-4" />Следующий
            </button>
          )}
        </div>
      ) : (
        <div className="py-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-emerald-500/20 border border-emerald-500/30">
            <Trophy className="w-10 h-10 text-emerald-400" />
          </div>
          <p className="text-4xl font-black text-[#a78bfa] tabular-nums mb-1">{score}/5</p>
          <p className="text-xs text-[#64748b] mb-1">
            {score === 5 ? 'ИДЕАЛЬНО!' : score >= 3 ? 'Неплохо!' : score >= 1 ? 'Можешь лучше!' : 'Ноль...'}
          </p>
          {score >= highScore && score > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-lg mb-2">🏆 НОВЫЙ РЕКОРД!</motion.div>
          )}
          <p className="text-xs text-[#475569] mb-6">Рекорд: {highScore}/5</p>
          <button onClick={startAiming} className="btn-primary">
            <RotateCcw className="w-4 h-4" />Ещё раз
          </button>
        </div>
      )}
    </div>
  )
}
