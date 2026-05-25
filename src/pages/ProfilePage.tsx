import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import QRCard from '../components/QRCard'
import SettingsPanel from '../components/SettingsPanel'
import ExportImport from '../components/ExportImport'
import SyncStatus from '../components/SyncStatus'
import OnboardingHints from '../components/OnboardingHints'
import PlayerManager from '../components/PlayerManager'
import { User, Calendar, Settings, Download, Users } from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [tab, setTab] = useState('profile')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  if (!user) return (
    <div className="text-center py-20">
      <User className="w-10 h-10 mx-auto mb-3 text-[#2a2a3a]" />
      <p className="text-sm text-[#64748b]">Загрузка...</p>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#64748b] text-xs tracking-[0.2em] uppercase mb-1">Profile</p>
          <h1 className="heading-lg"><span className="text-gradient">Профиль</span></h1>
        </div>
        <SyncStatus />
      </div>

      <div className="flex gap-2 p-1 bg-[#1a1a25]/80 rounded-xl border border-[#2a2a3a]/30 overflow-x-auto">
        {[
          { id: 'profile', label: 'Профиль', icon: User },
          { id: 'players', label: 'Игроки', icon: Users },
          { id: 'settings', label: 'Настройки', icon: Settings },
          { id: 'data', label: 'Данные', icon: Download },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={tab === t.id ? 'tab-active' : 'tab-inactive'}>
            <t.icon className="w-3.5 h-3.5 inline mr-1.5" />{t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <>
          <div className="card p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
              >{(user.email?.charAt(0) || '?').toUpperCase()}</div>
              <div className="space-y-1.5">
                <div className="font-medium text-sm text-[#cbd5e1] flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#475569]" />{user.email}
                </div>
                <div className="text-xs text-[#64748b] flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  {new Date(user.created_at).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs text-[#64748b] tracking-[0.15em] uppercase mb-4">Мой QR</p>
            <QRCard value={`${window.location.origin}/player/${user.id}`} />
          </div>
        </>
      )}

      {tab === 'players' && <PlayerManager />}

      {tab === 'settings' && <SettingsPanel />}

      {tab === 'data' && <ExportImport />}

      <OnboardingHints />
    </div>
  )
}
