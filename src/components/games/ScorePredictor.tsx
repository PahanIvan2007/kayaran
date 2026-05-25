import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Trophy, RotateCcw, CheckCircle2, XCircle, TrendingUp } from 'lucide-react'
import { api } from '../../lib/api'

export default function ScorePredictor() {
  const [matches, setMatches] = useState<any[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [predictions, setPredictions] = useState<Record<string, { a: number; b: number }>>({})
  const [phase, setPhase] = useState<'loading' | 'predict' | 'result' | 'done'>('loading')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('kayaran_predict_high') || 0))
  const [revealed, setRevealed] = useState(false)
  const [guessA, setGuessA] = useState('')
  const [guessB, setGuessB] = useState('')

  useEffect(() => {
    api.getMatches().then(m => {
      const finished = m.filter((mm: any) => mm.status === 'finished')
      setMatches(finished.sort(() => Math.random() - 0.5).slice(0, 5))
      setPhase(finished.length > 0 ? 'predict' : 'loading')
    })
  }, [])

  const current = matches[currentIdx]
  if (!current && phase === 'predict') setPhase('done')

  const handlePredict = () => {
    const a = parseInt(guessA)
    const b = parseInt(guessB)
    if (isNaN(a) || isNaN(b)) return

    setPredictions(p => ({ ...p, [current.id]: { a, b } }))
    setRevealed(true)
  }

  const handleNext = () => {
    const pred = predictions[current.id]
    const isCorrect = pred.a === current.score_a && pred.b === current.score_b
    const isClose = Math.abs(pred.a - current.score_a) + Math.abs(pred.b - current.score_b) <= 2

    if (isCorrect) setScore(s => s + 3)
    else if (isClose) setScore(s => s + 1)

    setRevealed(false)
    setGuessA('')
    setGuessB('')

    if (currentIdx + 1 >= matches.length) {
      if (score > highScore) {
        setHighScore(score)
        localStorage.setItem('kayaran_predict_high', String(score))
      }
      setPhase('done')
    } else {
      setCurrentIdx(i => i + 1)
    }
  }

  if (phase === 'loading') return (
    <div className="glass-card p-6 text-center">
      <Brain className="w-8 h-8 mx-auto mb-3 text-[#475569]" />
      <p className="text-sm text-[#64748b]">Нет завершённых матчей для предсказаний</p>
      <p className="text-xs text-[#475569] mt-1">Сыграйте матчи в турнире</p>
    </div>
  )

  return (
    <div className="glass-card p-6 text-center select-none">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-[#a78bfa]" />
        <span className="text-sm text-[#64748b] tracking-[0.15em] uppercase">Score Predictor</span>
      </div>

      {phase === 'predict' && current && (
        <div>
          <div className="flex items-center justify-center gap-2 mb-6">
            {matches.map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${i < currentIdx ? 'bg-[#8b5cf6]' : i === currentIdx ? 'bg-[#a78bfa] animate-pulse' : 'bg-[#2a2a3a]'}`} />
            ))}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-right">
                <p className="text-sm font-medium text-[#cbd5e1]">{typeof current.team_a === 'object' ? current.team_a?.name : 'Team A'}</p>
              </div>
              {!revealed ? (
                <div className="flex items-center gap-2">
                  <input className="input w-16 text-center text-lg font-black tabular-nums" type="number" min="0" max="20"
                    value={guessA} onChange={e => setGuessA(e.target.value)} placeholder="?" />
                  <span className="text-lg text-[#475569]">:</span>
                  <input className="input w-16 text-center text-lg font-black tabular-nums" type="number" min="0" max="20"
                    value={guessB} onChange={e => setGuessB(e.target.value)} placeholder="?" />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-[#a78bfa] tabular-nums">{current.score_a}</span>
                  <span className="text-sm text-[#475569]">:</span>
                  <span className="text-3xl font-black text-[#a78bfa] tabular-nums">{current.score_b}</span>
                </div>
              )}
              <div className="text-left">
                <p className="text-sm font-medium text-[#cbd5e1]">{typeof current.team_b === 'object' ? current.team_b?.name : 'Team B'}</p>
              </div>
            </div>

            {revealed ? (
              <div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  {predictions[current.id].a === current.score_a && predictions[current.id].b === current.score_b ? (
                    <span className="text-emerald-400 text-sm flex items-center gap-1"><CheckCircle2 className="w-4 h-4" />Точный счёт! +3</span>
                  ) : Math.abs(predictions[current.id].a - current.score_a) + Math.abs(predictions[current.id].b - current.score_b) <= 2 ? (
                    <span className="text-amber-400 text-sm flex items-center gap-1"><TrendingUp className="w-4 h-4" />Близко! +1</span>
                  ) : (
                    <span className="text-red-400 text-sm flex items-center gap-1"><XCircle className="w-4 h-4" />Мимо</span>
                  )}
                </div>
                <button onClick={handleNext} className="btn-primary">
                  {currentIdx + 1 >= matches.length ? <Trophy className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                  {currentIdx + 1 >= matches.length ? 'Результат' : 'Дальше'}
                </button>
              </div>
            ) : (
              <button onClick={handlePredict} disabled={!guessA || !guessB} className="btn-primary">
                <Brain className="w-4 h-4" />Угадать!
              </button>
            )}

            <p className="text-xs text-[#475569] mt-3">Очки: {score}</p>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="py-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-amber-500/20 border border-amber-500/30">
            <Trophy className="w-10 h-10 text-amber-400" />
          </div>
          <p className="text-4xl font-black text-[#a78bfa] tabular-nums mb-1">{score}</p>
          <p className="text-xs text-[#64748b] mb-1">из {matches.length * 3} возможных</p>
          <p className="text-xs text-[#475569] mb-6">Точность: {Math.round((score / (matches.length * 3)) * 100)}%</p>
          {score >= highScore && score > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-lg mb-2">🏆 НОВЫЙ РЕКОРД!</motion.div>
          )}
          <button onClick={() => window.location.reload()} className="btn-primary">
            <RotateCcw className="w-4 h-4" />Ещё раз
          </button>
        </div>
      )}
    </div>
  )
}
