import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { calculatePlayerStats, type PlayerStat } from '../lib/stats'
import { motion } from 'framer-motion'
import { Trophy, Swords, Loader2 } from 'lucide-react'

export default function PlayerStats({ tournamentId }: { tournamentId?: string }) {
  const [stats, setStats] = useState<PlayerStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [matches, teams] = await Promise.all([
        tournamentId ? api.getMatches(tournamentId) : api.getMatches(),
        api.getTeams()
      ])
      setStats(calculatePlayerStats(matches, teams))
      setLoading(false)
    }
    load()
  }, [tournamentId])

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 text-[#8b5cf6] animate-spin" /></div>

  if (stats.length === 0) return (
    <div className="text-center py-12">
      <Swords className="w-8 h-8 mx-auto mb-2 text-[#475569]" />
      <p className="text-sm text-[#64748b]">Нет статистики игроков</p>
      <p className="text-[11px] text-[#475569] mt-1">Добавьте события матчей (голы, карточки)</p>
    </div>
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4 px-2">
        <Trophy className="w-4 h-4 text-[#a78bfa]" />
        <span className="text-xs text-[#64748b] tracking-[0.15em] uppercase">Бомбардиры</span>
      </div>
      {stats.slice(0, 10).map((player, i) => (
        <motion.div key={`${player.playerName}-${player.teamId}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
          className="card p-4 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-[#a78bfa]"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))', border: '1px solid rgba(139,92,246,0.1)' }}
          >
            {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-[#cbd5e1] truncate">{player.playerName}</p>
            <p className="text-[11px] text-[#475569]">{player.teamName}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-[#a78bfa] tabular-nums">{player.goals}</p>
            <p className="text-[10px] text-[#475569] uppercase tracking-wider">голов</p>
          </div>
          <div className="text-right ml-3">
            <p className="text-sm font-medium text-[#64748b] tabular-nums">{player.matchesPlayed}</p>
            <p className="text-[10px] text-[#475569] uppercase tracking-wider">игр</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
