import { useState } from 'react'
import { api } from '../lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit3, XCircle, Clock, CheckCircle2, X, Loader2 } from 'lucide-react'

interface Props { match: any; onUpdate: () => void }

export default function MatchActions({ match, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ field_name: match.field_name || '', starts_at: match.starts_at || '' })
  const [loading, setLoading] = useState(false)

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    await api.updateMatch(match.id, { field_name: form.field_name || null, starts_at: form.starts_at || null })
    setEditing(false); setLoading(false); onUpdate()
  }

  const handleCancel = async () => {
    if (!confirm('Отменить матч?')) return
    await api.cancelMatch(match.id); onUpdate()
  }

  const handlePostpone = async () => {
    const newDate = prompt('Новая дата (YYYY-MM-DDTHH:MM):')
    if (newDate) { await api.updateMatch(match.id, { starts_at: newDate, status: 'pending' }); onUpdate() }
  }

  if (match.status === 'cancelled') return null

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => setEditing(!editing)} className="p-1.5 text-[#475569] hover:text-[#e2e8f0] transition-colors" title="Редактировать">
        <Edit3 className="w-3.5 h-3.5" />
      </button>
      <button onClick={handlePostpone} className="p-1.5 text-[#475569] hover:text-amber-400 transition-colors" title="Перенести">
        <Clock className="w-3.5 h-3.5" />
      </button>
      <button onClick={handleCancel} className="p-1.5 text-[#475569] hover:text-red-400 transition-colors" title="Отменить">
        <XCircle className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {editing && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleEdit} className="absolute left-0 right-0 top-full mt-2 z-20 glass-card p-4 space-y-3 overflow-hidden"
          >
            <input className="input text-sm" placeholder="Поле" value={form.field_name} onChange={e => setForm({...form, field_name: e.target.value})} />
            <input type="datetime-local" className="input text-sm" value={form.starts_at} onChange={e => setForm({...form, starts_at: e.target.value})} />
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="btn-primary text-xs">
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}Сохранить
              </button>
              <button type="button" onClick={() => setEditing(false)} className="btn-ghost text-xs"><X className="w-3 h-3" /></button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
