// Feature 3: Goal/score events timeline
import { motion } from 'framer-motion'
import { Footprints, Clock, AlertTriangle } from 'lucide-react'

interface ScoreEvent {
  team: string
  time: string
  player?: string
  type?: 'goal' | 'yellow' | 'red'
}

interface Props { events: ScoreEvent[] }

export default function GoalTimeline({ events }: Props) {
  if (events.length === 0) return (
    <div className="text-center py-6">
      <Footprints className="w-6 h-6 mx-auto mb-2 text-[#2a2a3a]" />
      <p className="text-xs text-[#475569]">История событий пуста</p>
    </div>
  )

  return (
    <div className="space-y-2">
      {events.map((ev, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-[#2a2a3a]/30"
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            ev.type === 'red' ? 'bg-red-500/20' : ev.type === 'yellow' ? 'bg-amber-500/20' : 'bg-emerald-500/20'
          }`}>
            {ev.type === 'goal' ? <Footprints className="w-4 h-4 text-emerald-400" />
              : <AlertTriangle className={`w-4 h-4 ${ev.type === 'red' ? 'text-red-400' : 'text-amber-400'}`} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#cbd5e1] truncate">
              {ev.team}{ev.player ? ` • ${ev.player}` : ''}
            </p>
            <p className="text-[11px] text-[#64748b]">{ev.type === 'goal' ? 'Гол' : ev.type === 'red' ? 'Красная карточка' : 'Жёлтая карточка'}</p>
          </div>
          <span className="text-xs font-mono text-[#475569] flex items-center gap-1">
            <Clock className="w-3 h-3" />{ev.time}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
