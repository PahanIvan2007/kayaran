import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { calculateRatings, type TeamRating } from '../lib/ratings'
import { motion } from 'framer-motion'
import { TrendingUp, Loader2 } from 'lucide-react'

export default function TeamRatings({ tournamentId }: { tournamentId?: string }) {
  const [ratings, setRatings] = useState<TeamRating[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [matches, teams] = await Promise.all([
        tournamentId ? api.getMatches(tournamentId) : api.getMatches(),
        api.getTeams()
      ])
      setRatings(calculateRatings(matches, teams))
      setLoading(false)
    }
    load()
  }, [tournamentId])

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 text-[#8b5cf6] animate-spin" /></div>

  const maxRating = Math.max(...ratings.map(r => r.rating), BASE_DISPLAY)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4 px-2">
        <TrendingUp className="w-4 h-4 text-[#a78bfa]" />
        <span className="text-xs text-[#64748b] tracking-[0.15em] uppercase">Рейтинг команд (ELO)</span>
      </div>
      {ratings.map((team, i) => {
        const barWidth = ((team.rating - BASE_DISPLAY + 200) / (maxRating - BASE_DISPLAY + 200)) * 100
        return (
          <motion.div key={team.teamId}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#475569] w-5">#{i + 1}</span>
                <span className="font-medium text-sm text-[#cbd5e1]">{team.teamName}</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-[#a78bfa] tabular-nums">{team.rating}</span>
                <span className="text-[10px] text-[#475569] ml-1">ELO</span>
              </div>
            </div>
            <div className="h-1.5 bg-[#1a1a25] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(barWidth, 100)}%` }}
                transition={{ duration: 0.8, delay: i * 0.04 }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)' }}
              />
            </div>
            <p className="text-[10px] text-[#475569] mt-1.5">{team.matchesPlayed} матчей</p>
          </motion.div>
        )
      })}
    </div>
  )
}

const BASE_DISPLAY = 1000
