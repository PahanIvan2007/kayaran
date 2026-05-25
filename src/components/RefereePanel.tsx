import { useState } from 'react'
import { api } from '../lib/api'
import { useTournamentStore } from '../store/useTournamentStore'
import { motion } from 'framer-motion'
import { Plus, Minus, Flag, Loader2 } from 'lucide-react'

interface Props {
  match: { id: string; score_a: number; score_b: number; status: string; team_a?: { name: string }; team_b?: { name: string } }
}

export default function RefereePanel({ match }: Props) {
  const [sA, setSA] = useState(match.score_a)
  const [sB, setSB] = useState(match.score_b)
  const [updating, setUpdating] = useState(false)
  const { updateMatchScore, updateMatchStatus } = useTournamentStore()

  const handleScore = async (team: 'a' | 'b', delta: number) => {
    const nA = team === 'a' ? Math.max(0, sA + delta) : sA
    const nB = team === 'b' ? Math.max(0, sB + delta) : sB
    setSA(nA); setSB(nB); setUpdating(true)
    try {
      await api.updateMatchScore(match.id, nA, nB)
      updateMatchScore(match.id, nA, nB)
      if (match.status === 'pending') { await api.updateMatchStatus(match.id, 'live'); updateMatchStatus(match.id, 'live') }
    } catch { setSA(match.score_a); setSB(match.score_b) }
    setUpdating(false)
  }

  const endMatch = async () => {
    await api.updateMatchStatus(match.id, 'finished')
    updateMatchStatus(match.id, 'finished')
  }

  return (
    <div className="glass-card-glow p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-8">
        {updating && <Loader2 className="w-4 h-4 animate-spin text-[#a78bfa]" />}
        <span className="text-xs text-[#64748b] tracking-[0.15em] uppercase">Судейская панель</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="text-center flex-1">
          <p className="text-xs text-[#64748b] mb-4 tracking-wide">{match.team_a?.name || 'Team A'}</p>
          <motion.div key={sA} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-6xl sm:text-7xl font-black text-[#a78bfa] tabular-nums" style={{ textShadow: '0 0 30px rgba(139,92,246,0.2)' }}>
            {String(sA).padStart(2, '0')}
          </motion.div>
          <div className="flex gap-2 justify-center mt-5">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleScore('a', 1)} className="btn-success px-6 py-3 text-xl"><Plus className="w-5 h-5" /></motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleScore('a', -1)} disabled={sA === 0} className="btn-ghost px-6 py-3 text-xl"><Minus className="w-5 h-5" /></motion.button>
          </div>
        </div>

        <div className="text-lg font-bold text-[#2a2a3a] mx-4 sm:mx-8 tracking-widest">VS</div>

        <div className="text-center flex-1">
          <p className="text-xs text-[#64748b] mb-4 tracking-wide">{match.team_b?.name || 'Team B'}</p>
          <motion.div key={sB} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-6xl sm:text-7xl font-black text-[#a78bfa] tabular-nums" style={{ textShadow: '0 0 30px rgba(139,92,246,0.2)' }}>
            {String(sB).padStart(2, '0')}
          </motion.div>
          <div className="flex gap-2 justify-center mt-5">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleScore('b', 1)} className="btn-success px-6 py-3 text-xl"><Plus className="w-5 h-5" /></motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleScore('b', -1)} disabled={sB === 0} className="btn-ghost px-6 py-3 text-xl"><Minus className="w-5 h-5" /></motion.button>
          </div>
        </div>
      </div>

      {match.status === 'live' && (
        <div className="flex justify-center pt-4 border-t border-[#2a2a3a]/50">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={endMatch} className="btn-danger px-8 py-3">
            <Flag className="w-4 h-4" />Завершить матч
          </motion.button>
        </div>
      )}
    </div>
  )
}
