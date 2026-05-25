import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import RefereePanel from '../components/RefereePanel'
import QRCard from '../components/QRCard'
import EventManager from '../components/EventManager'
import MatchActions from '../components/MatchActions'
import { motion, AnimatePresence } from 'framer-motion'
import { Swords, QrCode, ArrowLeft, Loader2, ListTree, Settings } from 'lucide-react'

const tabs = [
  { id: 'panel', label: 'Панель', icon: Swords },
  { id: 'events', label: 'События', icon: ListTree },
  { id: 'qr', label: 'QR', icon: QrCode },
  { id: 'settings', label: 'Настройки', icon: Settings },
]

export default function RefereePage() {
  const { matchId } = useParams<{ matchId: string }>()
  const navigate = useNavigate()
  const [match, setMatch] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('panel')

  useEffect(() => {
    if (!matchId) return
    loadMatch()
    const ch = supabase.channel(`match-${matchId}`).on('postgres_changes' as never,
      { event: '*', schema: 'public', table: 'matches', filter: `id=eq.${matchId}` } as never, () => loadMatch()
    ).subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [matchId])

  const loadMatch = async () => {
    if (!matchId) return
    const { data } = await supabase.from('matches').select('*, team_a:team_a(*), team_b:team_b(*)').eq('id', matchId).single()
    if (data) setMatch(data); setLoading(false)
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 text-[#8b5cf6] animate-spin" /></div>
  if (!match) return <div className="text-center py-24"><p className="text-[#64748b]">Матч не найден</p></div>

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="btn-ghost -ml-2 text-xs"><ArrowLeft className="w-3.5 h-3.5" />Назад</button>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-medium text-sm text-[#94a3b8]">{match.team_a?.name}</span>
          <span className="text-2xl font-black text-[#a78bfa] tabular-nums">{match.score_a}:{match.score_b}</span>
          <span className="font-medium text-sm text-[#94a3b8]">{match.team_b?.name}</span>
        </div>
        {match.status === 'live' && <span className="badge-live text-[11px]"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block mr-1" />LIVE</span>}
      </div>

      <div className="flex gap-2 p-1 bg-[#1a1a25]/80 rounded-xl border border-[#2a2a3a]/30 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={tab === t.id ? 'tab-active whitespace-nowrap' : 'tab-inactive whitespace-nowrap'}>
            <t.icon className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />{t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
          {tab === 'panel' && <RefereePanel match={match} />}
          {tab === 'events' && <EventManager match={match} teamA={match.team_a} teamB={match.team_b} onUpdate={loadMatch} />}
          {tab === 'qr' && <div className="max-w-sm mx-auto"><QRCard value={`${window.location.origin}/referee/${match.id}`} title="QR матча" /></div>}
          {tab === 'settings' && (
            <div className="relative">
              <MatchActions match={match} onUpdate={loadMatch} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
