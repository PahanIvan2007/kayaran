// Feature 1: Leaderboard/Standings
import { Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import type { StandingsRow } from '../lib/standings'

interface Props { rows: StandingsRow[] }

const rankIcons = ['🥇', '🥈', '🥉']

export default function Leaderboard({ rows }: Props) {
  if (rows.length === 0) return (
    <div className="text-center py-8">
      <p className="text-xs text-[#64748b]">Нет завершённых матчей для расчёта</p>
    </div>
  )

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-4 py-3 border-b border-[#2a2a3a]/50">
        <p className="text-xs text-[#64748b] tracking-[0.15em] uppercase flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5" />Турнирная таблица
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] text-[#475569] uppercase tracking-wider border-b border-[#2a2a3a]/30">
              <th className="px-3 py-2.5 text-left">#</th>
              <th className="px-3 py-2.5 text-left">Команда</th>
              <th className="px-3 py-2.5 text-center">И</th>
              <th className="px-3 py-2.5 text-center">В</th>
              <th className="px-3 py-2.5 text-center">Н</th>
              <th className="px-3 py-2.5 text-center">П</th>
              <th className="px-3 py-2.5 text-center">РМ</th>
              <th className="px-3 py-2.5 text-center font-bold text-[#a78bfa]">О</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <motion.tr
                key={row.teamId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-[#2a2a3a]/20 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-3 py-3">
                  <span className="text-base">{rankIcons[i] || `#${i + 1}`}</span>
                </td>
                <td className="px-3 py-3 font-medium text-[#cbd5e1]">{row.teamName}</td>
                <td className="px-3 py-3 text-center text-[#94a3b8]">{row.played}</td>
                <td className="px-3 py-3 text-center text-emerald-400">{row.wins}</td>
                <td className="px-3 py-3 text-center text-amber-400">{row.draws}</td>
                <td className="px-3 py-3 text-center text-red-400">{row.losses}</td>
                <td className="px-3 py-3 text-center text-[#94a3b8]">{row.goalsFor}–{row.goalsAgainst}</td>
                <td className="px-3 py-3 text-center font-bold text-[#a78bfa] text-base">{row.points}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
