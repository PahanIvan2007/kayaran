// Feature 7: Tournament bracket (playoff view)
import { motion } from 'framer-motion'
import { Trophy, Swords } from 'lucide-react'

interface BracketMatch {
  round: number
  match: number
  teamA: string
  teamB: string
  scoreA: number
  scoreB: number
  winner?: string
}

interface Props { matches: any[] }

export default function TournamentBracket({ matches }: Props) {
  const rounds = matches.reduce((acc: any, m: any) => {
    if (m.status !== 'finished') return acc
    const teamAN = typeof m.team_a === 'object' ? m.team_a?.name : 'TBD'
    const teamBN = typeof m.team_b === 'object' ? m.team_b?.name : 'TBD'
    acc.push({ round: 1, match: acc.length + 1, teamA: teamAN, teamB: teamBN, scoreA: m.score_a, scoreB: m.score_b, winner: m.score_a > m.score_b ? teamAN : teamBN })
    return acc
  }, [] as BracketMatch[])

  if (rounds.length === 0) return (
    <div className="text-center py-8">
      <Swords className="w-6 h-6 mx-auto mb-2 text-[#2a2a3a]" />
      <p className="text-xs text-[#64748b]">Нет завершённых матчей для сетки</p>
    </div>
  )

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4 px-2">
        <Trophy className="w-4 h-4 text-[#a78bfa]" />
        <span className="text-xs text-[#64748b] tracking-[0.15em] uppercase">Сетка плей-офф</span>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        <div className="space-y-3">
          <p className="text-[11px] text-[#475569] uppercase tracking-wider mb-2">Раунд 1</p>
          {rounds.map((r: BracketMatch, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-[#1a1a25] border border-[#2a2a3a] rounded-xl p-3 min-w-[200px]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#cbd5e1] truncate flex-1">{r.teamA}</span>
                <span className="text-base font-bold text-[#a78bfa] ml-2">{r.scoreA}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#cbd5e1] truncate flex-1">{r.teamB}</span>
                <span className="text-base font-bold text-[#a78bfa] ml-2">{r.scoreB}</span>
              </div>
              {r.winner && (
                <div className="mt-2 pt-2 border-t border-[#2a2a3a] text-[11px] text-emerald-400 flex items-center gap-1">
                  <Trophy className="w-3 h-3" />{r.winner}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
