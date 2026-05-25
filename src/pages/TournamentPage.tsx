import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useTournamentStore } from '../store/useTournamentStore'
import { calculateStandings } from '../lib/standings'
import Matches from '../components/Matches'
import TeamList from '../components/TeamList'
import QRCard from '../components/QRCard'
import Leaderboard from '../components/Leaderboard'
import PlayerStats from '../components/PlayerStats'
import TeamRatings from '../components/TeamRatings'
import PlayoffBracket from '../components/PlayoffBracket'
import TournamentActions from '../components/TournamentActions'
import RoundRobinGenerator from '../components/RoundRobinGenerator'
import NotificationPrompt from '../components/NotificationPrompt'
import BracketExport from '../components/BracketExport'
import MapView from '../components/MapView'
import AddToCalendar from '../components/AddToCalendar'
import ShareButton from '../components/ShareButton'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Swords, Users, QrCode, ArrowLeft, Settings, Loader2, BarChart3, TrendingUp, Calendar } from 'lucide-react'

const tabs = [
  { id: 'matches', label: 'Матчи', icon: Swords },
  { id: 'standings', label: 'Таблица', icon: BarChart3 },
  { id: 'stats', label: 'Статистика', icon: Trophy },
  { id: 'ratings', label: 'Рейтинг', icon: TrendingUp },
  { id: 'teams', label: 'Команды', icon: Users },
  { id: 'qr', label: 'QR', icon: QrCode },
  { id: 'settings', label: 'Управление', icon: Settings },
]

export default function TournamentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { tournament, matches, teams, setTournament, setMatches, setTeams } = useTournamentStore()
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('matches')

  useEffect(() => { if (!id) return; loadTournament() }, [id])

  const loadTournament = async () => {
    const [t, m, tm] = await Promise.all([
      api.getTournament(id!),
      api.getMatches(id!),
      api.getTeams()
    ])
    setTournament(t)
    setMatches(m)
    setTeams(tm)
    setLoading(false)
  }

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="w-6 h-6 text-[#8b5cf6] animate-spin" /></div>

  if (!tournament) return (
    <div className="text-center py-24">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-[#1a1a25] border border-[#2a2a3a]">
        <Trophy className="w-8 h-8 text-[#475569]" />
      </div>
      <p className="text-[#64748b] font-medium">Турнир не найден</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <button onClick={() => navigate('/')} className="btn-ghost -ml-2 mb-4 text-xs"><ArrowLeft className="w-3.5 h-3.5" />Назад</button>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[#64748b] text-xs tracking-[0.2em] uppercase mb-1">Tournament</p>
            <h1 className="heading-lg"><span className="text-gradient">{tournament.title}</span></h1>
            {tournament.location && <p className="text-sm text-[#64748b] mt-1">{tournament.location}</p>}
            <div className="flex flex-wrap gap-2 mt-3">
              <ShareButton url={`${window.location.origin}/tournament/${tournament.id}`} />
            </div>
          </div>
          <span className={tournament.status === 'active' ? 'badge-active text-[11px]' : 'badge-draft text-[11px]'}>
            {tournament.status === 'active' ? 'Активен' : 'Черновик'}
          </span>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-[#1a1a25]/80 rounded-xl border border-[#2a2a3a]/30 overflow-x-auto scrollbar-hide">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={tab === t.id ? 'tab-active whitespace-nowrap' : 'tab-inactive whitespace-nowrap'}>
            <t.icon className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />{t.label}
          </button>
        ))}
      </div>

      <NotificationPrompt />

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-0">
          {tournament.location && (
            <MapView locations={[{ name: tournament.title, address: tournament.location, lat: (tournament as any).lat, lng: (tournament as any).lng }]} />
          )}
        </div>
        <div>
          {tournament.created_at && (
            <div className="glass-card p-4">
              <p className="text-xs text-[#64748b] tracking-[0.15em] uppercase mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />Добавить в календарь
              </p>
              <AddToCalendar
                title={tournament.title}
                description={`Турнир: ${tournament.title}`}
                location={tournament.location ?? undefined}
                startDate={tournament.created_at || ''}
              />
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
          {tab === 'matches' && (
            <div>
              <div className="flex justify-end mb-4">
                <button onClick={() => navigate(`/tournament/${id}/matches`)} className="btn-ghost text-xs"><Settings className="w-3.5 h-3.5" />Управлять</button>
              </div>
              <Matches tournamentId={id!} />
            </div>
          )}
          {tab === 'standings' && <Leaderboard rows={calculateStandings(matches, teams)} />}
          {tab === 'stats' && <PlayerStats tournamentId={id!} />}
          {tab === 'ratings' && (
            <div className="space-y-6">
              <TeamRatings tournamentId={id!} />
              <div data-bracket><PlayoffBracket standings={calculateStandings(matches, teams)} /></div>
              <BracketExport />
            </div>
          )}
          {tab === 'teams' && <TeamList />}
          {tab === 'qr' && <div className="max-w-sm mx-auto"><QRCard value={`${window.location.origin}/tournament/${tournament.id}`} title="QR турнира" /></div>}
          {tab === 'settings' && (
            <div className="space-y-4">
              <TournamentActions tournament={tournament} onUpdate={loadTournament} />
              <RoundRobinGenerator tournamentId={id!} teamIds={teams.map((t: any) => t.id)} onUpdate={loadTournament} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
