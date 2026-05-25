import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { Swords } from 'lucide-react'
import { formatScore, getMatchStatusLabel } from '../lib/utils'

export default function PlayerPage() {
  useParams<{ userId: string }>()
  const [matches, setMatches] = useState<any[]>([])

  useEffect(() => {
    loadMatches()
    const ch = supabase.channel('public-matches')
      .on('postgres_changes' as never, { event: '*', schema: 'public', table: 'matches' } as never, () => loadMatches())
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  const loadMatches = async () => {
    const { data } = await supabase.from('matches').select('*, team_a:team_a(*), team_b:team_b(*)').order('starts_at', { ascending: true })
    setMatches(data || [])
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8b5cf6] rounded-full opacity-[0.02] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#06b6d4] rounded-full opacity-[0.02] blur-[120px]" />
      </div>
      <div className="max-w-lg mx-auto px-4 py-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', boxShadow: '0 0 30px rgba(139,92,246,0.2)' }}
          ><span className="text-white font-black text-xl">K</span></div>
          <h1 className="text-xl font-black tracking-tight"><span className="text-gradient">Каяран</span></h1>
          <p className="text-xs text-[#64748b] tracking-[0.2em] uppercase mt-1">LIVE трансляция</p>
        </motion.div>

        {matches.length === 0 ? (
          <div className="text-center py-20">
            <Swords className="w-10 h-10 mx-auto mb-4 text-[#2a2a3a]" />
            <p className="text-[#64748b] text-sm">Ожидание матчей...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((match: any, i: number) => (
              <motion.div key={match.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${match.status === 'live' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : match.status === 'finished' ? 'bg-[#475569]/20 text-[#94a3b8] border border-[#475569]/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    {getMatchStatusLabel(match.status)}
                  </span>
                  {match.field_name && <span className="text-[11px] text-[#475569]">{match.field_name}</span>}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 text-center font-medium text-sm text-[#94a3b8]">{match.team_a?.name || 'Team A'}</div>
                  <div className="flex items-center gap-2 mx-3">
                    <span className="text-4xl font-black text-[#a78bfa] tabular-nums">{formatScore(match.score_a)}</span>
                    <span className="text-lg text-[#2a2a3a]">:</span>
                    <span className="text-4xl font-black text-[#a78bfa] tabular-nums">{formatScore(match.score_b)}</span>
                  </div>
                  <div className="flex-1 text-center font-medium text-sm text-[#94a3b8]">{match.team_b?.name || 'Team B'}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
