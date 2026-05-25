import { useState } from 'react'
import { api } from '../lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit3, Trash2, Copy, Archive, Power, CheckCircle2, X, Loader2 } from 'lucide-react'

interface Props { tournament: any; onUpdate: () => void }

export default function TournamentActions({ tournament, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: tournament.title, location: tournament.location || '' })
  const [loading, setLoading] = useState(false)

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    await api.updateTournament(tournament.id, { title: form.title, location: form.location || null })
    setEditing(false); setLoading(false); onUpdate()
  }

  const handleDelete = async () => {
    if (!confirm('Удалить турнир и все матчи?')) return
    await api.deleteTournament(tournament.id); onUpdate()
  }

  const handleDuplicate = async () => {
    await api.createTournament({ title: `${tournament.title} (копия)`, location: tournament.location, status: 'draft' })
    onUpdate()
  }

  const handleToggleStatus = async () => {
    await api.updateTournament(tournament.id, { status: tournament.status === 'active' ? 'draft' : 'active' })
    onUpdate()
  }

  const handleArchive = async () => {
    await api.updateTournament(tournament.id, { status: 'archived' })
    onUpdate()
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => setEditing(!editing)} className="btn-ghost text-xs"><Edit3 className="w-3 h-3" /></button>
      <button onClick={handleDuplicate} className="btn-ghost text-xs"><Copy className="w-3 h-3" /></button>
      <button onClick={handleToggleStatus} className="btn-ghost text-xs">
        <Power className="w-3 h-3 text-{tournament.status === 'active' ? 'emerald-400' : 'amber-400'}" />
      </button>
      <button onClick={handleArchive} className="btn-ghost text-xs"><Archive className="w-3 h-3" /></button>
      <button onClick={handleDelete} className="btn-ghost text-xs text-red-400"><Trash2 className="w-3 h-3" /></button>

      <AnimatePresence>
        {editing && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleEdit} className="w-full glass-card p-4 space-y-3 overflow-hidden"
          >
            <input className="input text-sm" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            <input className="input text-sm" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Локация" />
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="btn-primary text-xs">
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}Сохранить
              </button>
              <button type="button" onClick={() => setEditing(false)} className="btn-ghost text-xs"><X className="w-3 h-3" />Отмена</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
