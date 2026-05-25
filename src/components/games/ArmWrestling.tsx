import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, RotateCcw, Zap, Swords, Flame } from 'lucide-react'

type GamePhase = 'menu' | 'playing' | 'result' | 'done'

export default function ArmWrestling() {
  const [phase, setPhase] = useState<GamePhase>('menu')
  const [playerPos, setPlayerPos] = useState(50)
  const [, setAiPos] = useState(50)
  const [round, setRound] = useState(1)
  const [playerWins, setPlayerWins] = useState(0)
  const [aiWins, setAiWins] = useState(0)
  const [totalRounds] = useState(3)
  const [result, setResult] = useState<'win' | 'lose' | null>(null)
  const [power, setPower] = useState(50)
  const [winsNeeded] = useState(2)
  const animRef = useRef<number>(0)
  const powerRef = useRef(50)
  const dirRef = useRef(1)
  const tapping = useRef(false)

  const startGame = () => {
    setPhase('playing')
    setRound(1)
    setPlayerWins(0)
    setAiWins(0)
    setPlayerPos(50)
    setAiPos(50)
    setPower(50)
    setResult(null)
    startRound()
  }

  const startRound = () => {
    setPlayerPos(50)
    setAiPos(50)
    setPower(50)
    powerRef.current = 50
    dirRef.current = 1
    tapping.current = false

    const animate = () => {
      const drift = (Math.random() - 0.5) * 0.3
      let newPower = powerRef.current + (tapping.current ? 0.8 : -0.3) + drift
      newPower = Math.max(5, Math.min(95, newPower))
      powerRef.current = newPower
      setPower(newPower)

      const pPos = Math.min(100, Math.max(0, 50 + (newPower - 50) * 1.2))
      const aPos = Math.min(100, Math.max(0, 50 - (newPower - 50) * 1.2))
      setPlayerPos(pPos)
      setAiPos(aPos)

      if (pPos >= 98) {
        setResult('win')
        setPhase('result')
        return
      }
      if (aPos >= 98) {
        setResult('lose')
        setPhase('result')
        return
      }

      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
  }

  const tap = useCallback(() => {
    if (phase !== 'playing') return
    tapping.current = true
    setTimeout(() => { tapping.current = false }, 100)
  }, [phase])

  useEffect(() => {
    if (phase !== 'playing') return
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); tap() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase, tap])

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const handleResult = () => {
    if (result === 'win') setPlayerWins(w => w + 1)
    else setAiWins(w => w + 1)

    if (playerWins + (result === 'win' ? 1 : 0) >= winsNeeded || aiWins + (result === 'lose' ? 1 : 0) >= winsNeeded || round >= totalRounds) {
      setTimeout(() => setPhase('done'), 100)
    } else {
      setRound(r => r + 1)
      setTimeout(() => startRound(), 100)
    }
  }

  useEffect(() => {
    if (phase === 'result') handleResult()
  }, [phase === 'result'])

  return (
    <div className="glass-card p-4 sm:p-6 text-center select-none">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Swords className="w-5 h-5 text-[#a78bfa]" />
        <span className="text-sm text-[#64748b] tracking-[0.15em] uppercase">Arm Wrestling</span>
      </div>

      {phase === 'menu' && (
        <div className="py-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
            <Swords className="w-10 h-10 text-white" />
          </div>
          <p className="text-lg font-bold text-gradient mb-2">Армрестлинг</p>
          <p className="text-xs text-[#64748b] mb-1">Дави на пробел! Кто сильнее?</p>
          <p className="text-xs text-[#475569] mb-6">3 раунда · Тапай чтобы давить</p>
          <button onClick={startGame} className="btn-primary text-base px-10 py-4">
            <Swords className="w-5 h-5" />БОРОТЬСЯ!
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className={`text-xs font-medium ${playerWins > aiWins ? 'text-emerald-400' : 'text-[#64748b]'}`}>Вы: {playerWins}</span>
            <span className="text-xs text-[#475569]">Раунд {round}/{totalRounds}</span>
            <span className={`text-xs font-medium ${aiWins > playerWins ? 'text-red-400' : 'text-[#64748b]'}`}>AI: {aiWins}</span>
          </div>

          <div className="relative mx-auto mb-6" style={{ maxWidth: 300 }}>
            <div className="h-4 bg-[#1a1a25] rounded-full overflow-hidden border border-[#2a2a3a] relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[8px] text-[#475569] z-10">VS</span>
              </div>
              <motion.div className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] rounded-full transition-all duration-75"
                style={{ width: `${playerPos}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[#a78bfa]">Вы</span>
              <span className="text-[10px] text-red-400">AI</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-6">
            <Flame className="w-4 h-4 text-orange-400" />
            <div className="w-32 h-3 bg-[#1a1a25] rounded-full overflow-hidden border border-[#2a2a3a]">
              <motion.div className="h-full rounded-full transition-all duration-75"
                style={{
                  width: `${power}%`,
                  background: power > 70 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' :
                    power > 40 ? 'linear-gradient(90deg, #8b5cf6, #a78bfa)' :
                      'linear-gradient(90deg, #ef4444, #dc2626)'
                }}
              />
            </div>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onMouseDown={tap}
            className="btn-primary text-lg px-12 py-4"
          >
            <Zap className="w-5 h-5" />ДАВИ!
          </motion.button>
          <p className="text-[10px] text-[#475569] mt-2">Пробел / кнопка</p>
        </div>
      )}

      {phase === 'result' && (
        <div className="py-8">
          <AnimatePresence mode="wait">
            {result === 'win' ? (
              <motion.div key="win" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl mb-4">💪</motion.div>
            ) : (
              <motion.div key="lose" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl mb-4">😵</motion.div>
            )}
          </AnimatePresence>
          <p className={`text-xl font-bold mb-2 ${result === 'win' ? 'text-emerald-400' : 'text-red-400'}`}>
            {result === 'win' ? 'ВЫ ПОБЕДИЛИ!' : 'ВАС ПРИЖАЛИ!'}
          </p>
        </div>
      )}

      {phase === 'done' && (
        <div className="py-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-emerald-500/20 border border-emerald-500/30">
            <Trophy className="w-10 h-10 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-gradient mb-2">
            {playerWins > aiWins ? 'АБСОЛЮТНАЯ ПОБЕДА!' : 'В СЛЕДУЮЩИЙ РАЗ...'}
          </p>
          <p className="text-xs text-[#64748b] mb-4">{playerWins} - {aiWins}</p>
          <button onClick={startGame} className="btn-primary">
            <RotateCcw className="w-4 h-4" />Реванш
          </button>
        </div>
      )}
    </div>
  )
}
