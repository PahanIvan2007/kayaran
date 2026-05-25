import { useState } from 'react'
import { api } from '../lib/api'
import { Swords, Loader2, CheckCircle2 } from 'lucide-react'

interface Props { tournamentId: string; teamIds: string[]; onUpdate: () => void }

export default function RoundRobinGenerator({ tournamentId, teamIds, onUpdate }: Props) {
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    await api.generateRoundRobin(tournamentId, teamIds)
    setGenerating(false); setDone(true); onUpdate()
    setTimeout(() => setDone(false), 3000)
  }

  if (teamIds.length < 2) return (
    <div className="text-center py-4">
      <p className="text-xs text-[#475569]">Нужно минимум 2 команды для генерации</p>
    </div>
  )

  const matchCount = teamIds.length * (teamIds.length - 1) / 2

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#64748b] tracking-[0.15em] uppercase"><Swords className="w-3 h-3 inline" /> Круговая система</p>
          <p className="text-[10px] text-[#475569] mt-0.5">{teamIds.length} команд · {matchCount} матчей</p>
        </div>
        <button onClick={handleGenerate} disabled={generating || done} className="btn-primary text-xs">
          {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : done ? <CheckCircle2 className="w-3 h-3" /> : <Swords className="w-3 h-3" />}
          {generating ? '...' : done ? 'Готово' : 'Сгенерировать'}
        </button>
      </div>
    </div>
  )
}
