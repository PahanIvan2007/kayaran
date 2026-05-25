// Feature 16: Home stats dashboard
import { motion } from 'framer-motion'
import { Trophy, Swords, Users, Activity } from 'lucide-react'

interface Props { stats: { tournaments: number; matches: number; teams: number; live: number } }

const statCards = [
  { key: 'tournaments', label: 'Турниры', icon: Trophy, color: '#8b5cf6' },
  { key: 'matches', label: 'Матчи', icon: Swords, color: '#06b6d4' },
  { key: 'teams', label: 'Команды', icon: Users, color: '#10b981' },
  { key: 'live', label: 'LIVE', icon: Activity, color: '#f59e0b' }
]

export default function StatsDashboard({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {statCards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass-card p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${card.color}15`, border: `1px solid ${card.color}20` }}
          >
            <card.icon className="w-5 h-5" style={{ color: card.color }} />
          </div>
          <div>
            <p className="text-xl font-bold tabular-nums" style={{ color: card.color }}>
              {(stats as any)[card.key]}
            </p>
            <p className="text-[11px] text-[#64748b]">{card.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
