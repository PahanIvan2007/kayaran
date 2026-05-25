import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { api } from '../lib/api'
import { motion } from 'framer-motion'
import { Swords, MapPin, Loader2, Zap } from 'lucide-react'
import { formatDate, formatScore } from '../lib/utils'

interface Props { tournamentId: string }

export default function Matches({ tournamentId }: Props) {
  const navigate = useNavigate()
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMatches()
    const ch = api.subscribeToMatches(tournamentId, loadMatches)
    return () => { supabase.removeChannel(ch) }
  }, [tournamentId])

  const loadMatches = async () => {
    setMatches(await api.getMatches(tournamentId))
    setLoading(false)
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 text-[#8b5cf6] animate-spin" /></div>

  if (matches.length === 0) return (
    <div className="text-center py-12">
      <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 bg-[#1a1a25] border border-[#2a2a3a]">
        <Swords className="w-7 h-7 text-[#475569]" />
      </div>
      <p className="text-[#64748b] text-sm">Матчи ещё не добавлены</p>
    </div>
  )

  return (
    <div className="space-y-3">
      {matches.map((match: any, i: number) => {
        const isLive = match.status === 'live'
        const isFinished = match.status === 'finished'
        const teamAName = typeof match.team_a === 'object' ? match.team_a?.name : 'Team A'
        const teamBName = typeof match.team_b === 'object' ? match.team_b?.name : 'Team B'

        return (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.005 }}
            onClick={() => navigate(`/referee/${match.id}`)}
            className={`card-hover p-4 sm:p-5 ${isLive ? 'bg-[#8b5cf6]/[0.03]' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {isLive && (
                  <span className="badge-live text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    LIVE
                  </span>
                )}
                {isFinished && <span className="badge-finished text-[11px]">Завершён</span>}
                {match.status === 'pending' && <span className="badge-pending text-[11px]">Ожидание</span>}
              </div>
              {match.field_name && (
                <span className="text-[11px] text-[#475569] flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{match.field_name}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 text-right">
                <p className="text-sm sm:text-base font-semibold line-clamp-1 text-[#94a3b8]">{teamAName}</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className={`text-3xl sm:text-4xl font-black tabular-nums ${isLive ? 'text-[#a78bfa] text-glow' : isFinished ? 'text-[#64748b]' : 'text-[#e2e8f0]'}`}>
                  {formatScore(match.score_a)}
                </span>
                <span className="text-base font-bold text-[#2a2a3a]">:</span>
                <span className={`text-3xl sm:text-4xl font-black tabular-nums ${isLive ? 'text-[#a78bfa] text-glow' : isFinished ? 'text-[#64748b]' : 'text-[#e2e8f0]'}`}>
                  {formatScore(match.score_b)}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm sm:text-base font-semibold line-clamp-1 text-[#94a3b8]">{teamBName}</p>
              </div>
            </div>

            {match.starts_at && (
              <p className="text-[11px] text-[#475569] mt-2 text-center">{formatDate(match.starts_at)}</p>
            )}

            {isLive && (
              <div className="mt-3 flex justify-center">
                <span className="text-[11px] font-medium text-[#a78bfa] flex items-center gap-1 animate-pulse-neon">
                  <Zap className="w-3 h-3" />Управление
                </span>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
