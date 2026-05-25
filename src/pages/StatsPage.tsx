import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import Leaderboard from '../components/Leaderboard'
import PlayerStats from '../components/PlayerStats'
import TeamRatings from '../components/TeamRatings'
import { motion } from 'framer-motion'
import { Trophy, Swords, Users, Loader2, TrendingUp, Activity } from 'lucide-react'
import ExcelExport from '../components/ExcelExport'

export default function StatsPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ tournaments: 0, matches: 0, teams: 0, live: 0 })
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    const load = async () => {
      const [tournaments, matches, teams] = await Promise.all([
        api.getTournaments(),
        api.getMatches(),
        api.getTeams()
      ])
      setStats({
        tournaments: tournaments.length,
        matches: matches.length,
        teams: teams.length,
        live: matches.filter((m: any) => m.status === 'live').length
      })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="w-6 h-6 text-[#8b5cf6] animate-spin" /></div>

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: Activity },
    { id: 'standings', label: 'Таблица', icon: Trophy },
    { id: 'players', label: 'Игроки', icon: Users },
    { id: 'ratings', label: 'Рейтинг', icon: TrendingUp },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#64748b] text-xs tracking-[0.2em] uppercase mb-1">Statistics</p>
          <h1 className="heading-lg"><span className="text-gradient">Статистика</span></h1>
        </div>
        <ExcelExport />
      </div>

      <div className="flex gap-2 p-1 bg-[#1a1a25]/80 rounded-xl border border-[#2a2a3a]/30 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={tab === t.id ? 'tab-active whitespace-nowrap' : 'tab-inactive whitespace-nowrap'}>
            <t.icon className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />{t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
        {tab === 'overview' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Турниры', value: stats.tournaments, icon: Trophy, color: '#8b5cf6' },
              { label: 'Матчи', value: stats.matches, icon: Swords, color: '#06b6d4' },
              { label: 'Команды', value: stats.teams, icon: Users, color: '#10b981' },
              { label: 'LIVE', value: stats.live, icon: Activity, color: '#f59e0b' },
            ].map((card, i) => (
              <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${card.color}15`, border: `1px solid ${card.color}20` }}>
                  <card.icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                <div>
                  <p className="text-xl font-bold tabular-nums" style={{ color: card.color }}>{card.value}</p>
                  <p className="text-[11px] text-[#64748b]">{card.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {tab === 'standings' && <Leaderboard rows={[]} />}
        {tab === 'players' && <PlayerStats />}
        {tab === 'ratings' && <TeamRatings />}
      </motion.div>
    </div>
  )
}
