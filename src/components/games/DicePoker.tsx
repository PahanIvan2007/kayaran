import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, RotateCcw, Trophy } from 'lucide-react'

const DICE_ICONS = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]

function rollDie() { return Math.floor(Math.random() * 6) + 1 }

function rollAll(): number[] { return Array.from({ length: 5 }, () => rollDie()) }

function scoreDice(dice: number[]): { name: string; score: number } {
  const counts = Array(7).fill(0)
  dice.forEach(d => counts[d]++)
  const sorted = [...dice].sort((a, b) => b - a)
  const unique = new Set(dice)

  if (counts.includes(5)) return { name: 'Покер 🎲', score: 50 }
  if (counts.includes(4)) return { name: 'Каре', score: 30 + sorted[0] }
  if (counts.includes(3) && counts.includes(2)) return { name: 'Фулл Хаус', score: 25 }
  if (counts.includes(3)) return { name: 'Тройка', score: 15 + sorted[0] }
  if (counts.filter(c => c === 2).length === 2) return { name: 'Две Пары', score: 10 + sorted[0] + sorted[2] }
  if (counts.filter(c => c === 2).length === 1) return { name: 'Пара', score: 5 + sorted[0] }
  if (unique.size === 5 && sorted[0] - sorted[4] === 4) return { name: 'Стрит 🔥', score: 35 + sorted[0] }
  if (unique.size === 5 && (sorted[0] === 6 && sorted[4] === 1 && sorted[1] === 2 && sorted[2] === 3 && sorted[3] === 4))
    return { name: 'Малый Стрит', score: 30 }
  return { name: 'Старшая', score: sorted[0] }
}

type GamePhase = 'menu' | 'roll' | 'reroll' | 'result' | 'done'

export default function DicePoker() {
  const [phase, setPhase] = useState<GamePhase>('menu')
  const [dice, setDice] = useState<number[]>(Array(5).fill(1))
  const [held, setHeld] = useState<boolean[]>(Array(5).fill(false))
  const [rollsLeft, setRollsLeft] = useState(3)
  const [playerScore, setPlayerScore] = useState(0)
  const [prevScore, setPrevScore] = useState<{ name: string; score: number } | null>(null)
  const [highScore] = useState(() => Number(localStorage.getItem('kayaran_dice_high') || 0))
  const [round, setRound] = useState(1)
  const [totalRounds] = useState(5)
  const [rolling, setRolling] = useState(false)
  const [aiScore, setAiScore] = useState(0)

  const startGame = useCallback(() => {
    setPhase('roll')
    setDice(Array(5).fill(1))
    setHeld(Array(5).fill(false))
    setRollsLeft(3)
    setPlayerScore(0)
    setAiScore(0)
    setRound(1)
    setPrevScore(null)
    setRolling(false)
  }, [])

  const roll = () => {
    if (rollsLeft <= 0 || rolling) return
    setRolling(true)

    const newDice = dice.map((d, i) => held[i] ? d : rollDie())
    setDice(newDice)
    setRollsLeft(r => r - 1)

    setTimeout(() => {
      setRolling(false)
      if (rollsLeft - 1 === 0) {
        const result = scoreDice(newDice)
        setPrevScore(result)
        setPlayerScore(s => s + result.score)

        const aiRoll = rollAll()
        const aiResult = scoreDice(aiRoll)
        setAiScore(s => s + aiResult.score)

        if (round >= totalRounds) {
          setPhase('done')
        } else {
          setPhase('result')
        }
      }
    }, 500)
  }

  const toggleHold = (i: number) => {
    if (rollsLeft <= 0 || rolling) return
    setHeld(h => h.map((v, j) => j === i ? !v : v))
  }

  const nextRound = () => {
    setDice(Array(5).fill(1))
    setHeld(Array(5).fill(false))
    setRollsLeft(3)
    setPrevScore(null)
    setRound(r => r + 1)
    setPhase('roll')
  }

  const totalScore = playerScore
  if (totalScore > highScore) {
    localStorage.setItem('kayaran_dice_high', String(totalScore))
  }

  return (
    <div className="glass-card p-4 sm:p-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Dice1 className="w-5 h-5 text-[#a78bfa]" />
        <span className="text-sm text-[#64748b] tracking-[0.15em] uppercase">Dice Poker</span>
      </div>

      {phase === 'menu' && (
        <div className="py-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
            <Dice6 className="w-10 h-10 text-white" />
          </div>
          <p className="text-lg font-bold text-gradient mb-2">Dice Poker</p>
          <p className="text-xs text-[#64748b] mb-1">Покер на костях из Ведьмака</p>
          <p className="text-xs text-[#475569] mb-6">5 раундов · 3 броска за раунд</p>
          <button onClick={startGame} className="btn-primary text-base px-10 py-4">
            <Dice6 className="w-5 h-5" />ИГРАТЬ!
          </button>
        </div>
      )}

      {(phase === 'roll' || phase === 'reroll') && (
        <div>
          <div className="flex items-center justify-center gap-3 mb-6">
            {dice.map((val, i) => {
              const Icon = DICE_ICONS[val - 1]
              return (
                <motion.button key={i} whileHover={{ y: -4 }} whileTap={{ scale: 0.9 }}
                  onClick={() => toggleHold(i)}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${held[i] ? 'bg-[#8b5cf6]/20 border-2 border-[#8b5cf6]' : 'bg-[#1a1a25] border border-[#2a2a3a] hover:border-[#8b5cf6]/50'}`}
                >
                  <Icon className={`w-8 h-8 ${held[i] ? 'text-[#a78bfa]' : 'text-[#64748b]'}`} />
                </motion.button>
              )
            })}
          </div>

          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="text-center">
              <p className="text-sm font-bold text-[#a78bfa] tabular-nums">{rollsLeft}</p>
              <p className="text-[10px] text-[#475569]">Бросков</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-[#cbd5e1] tabular-nums">{round}/{totalRounds}</p>
              <p className="text-[10px] text-[#475569]">Раунд</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-[#f59e0b] tabular-nums">{playerScore}</p>
              <p className="text-[10px] text-[#475569]">Очки</p>
            </div>
          </div>

          {prevScore && (
            <p className="text-sm text-[#64748b] mb-4">Текущая комбинация: {prevScore.name} (+{prevScore.score})</p>
          )}

          {rollsLeft === 0 ? (
            <button onClick={() => {
              const result = scoreDice(dice)
              setPrevScore(result)
              setPlayerScore(s => s + result.score)
              const aiRoll = rollAll()
              setAiScore(s => s + scoreDice(aiRoll).score)
              if (round >= totalRounds) setPhase('done')
              else setPhase('result')
            }} className="btn-primary">
              <Trophy className="w-4 h-4" />Завершить раунд
            </button>
          ) : (
            <button onClick={roll} disabled={rolling} className="btn-primary">
              {rolling ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Dice6 className="w-4 h-4" />}
              Бросить ({rollsLeft})
            </button>
          )}
        </div>
      )}

      {phase === 'result' && (
        <div className="py-6">
          <p className="text-lg font-bold text-[#cbd5e1] mb-2">Раунд {round - 1}</p>
          <p className="text-3xl font-black text-[#a78bfa] tabular-nums mb-1">{playerScore}</p>
          <p className="text-xs text-[#64748b] mb-1">{prevScore?.name}</p>
          <p className="text-xs text-[#475569] mb-4">Противник: {aiScore} очков</p>
          <button onClick={nextRound} className="btn-primary">
            <Dice6 className="w-4 h-4" />Следующий раунд
          </button>
        </div>
      )}

      {phase === 'done' && (
        <div className="py-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-emerald-500/20 border border-emerald-500/30">
            <Trophy className="w-10 h-10 text-emerald-400" />
          </div>
          <p className="text-4xl font-black text-[#a78bfa] tabular-nums mb-1">{playerScore}</p>
          <p className="text-xs text-[#64748b] mb-1">Противник: {aiScore}</p>
          <p className={`text-sm font-bold mb-4 ${playerScore > aiScore ? 'text-emerald-400' : 'text-red-400'}`}>
            {playerScore > aiScore ? 'ПОБЕДА!' : playerScore === aiScore ? 'НИЧЬЯ' : 'ПОРАЖЕНИЕ'}
          </p>
          {playerScore > aiScore && <p className="text-xs text-[#475569] mb-4">Рекорд: {highScore}</p>}
          <button onClick={startGame} className="btn-primary">
            <RotateCcw className="w-4 h-4" />Ещё раз
          </button>
        </div>
      )}
    </div>
  )
}
