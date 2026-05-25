// Feature 15: Match history with filters
import { Swords, Clock, CheckCircle2, XCircle } from 'lucide-react'

interface Props {
  matches: any[]
  filter: string
  onFilterChange: (f: string) => void
}

const filters = [
  { id: 'all', label: 'Все', icon: Swords },
  { id: 'live', label: 'LIVE', icon: Clock },
  { id: 'finished', label: 'Завершённые', icon: CheckCircle2 },
  { id: 'pending', label: 'Ожидание', icon: XCircle }
]

export default function MatchHistory({ matches: _matches, filter, onFilterChange }: Props) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {filters.map(f => (
        <button
          key={f.id}
          onClick={() => onFilterChange(f.id)}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
            filter === f.id
              ? 'bg-[#8b5cf6]/15 text-[#a78bfa] border border-[#8b5cf6]/20'
              : 'bg-[#1a1a25] text-[#64748b] border border-[#2a2a3a] hover:border-[#475569]'
          }`}
        >
          <f.icon className="w-3 h-3 inline mr-1 -mt-0.5" />
          {f.label}
        </button>
      ))}
    </div>
  )
}
