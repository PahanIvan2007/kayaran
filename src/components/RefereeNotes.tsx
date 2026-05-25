// Feature 8: Referee notes for matches
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StickyNote, Plus, X } from 'lucide-react'

interface Note { id: string; text: string; created: string }

export default function RefereeNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [showForm, setShowForm] = useState(false)
  const [text, setText] = useState('')

  const addNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    setNotes([...notes, { id: Date.now().toString(), text: text.trim(), created: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) }])
    setText(''); setShowForm(false)
  }

  const deleteNote = (id: string) => setNotes(notes.filter(n => n.id !== id))

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-[#64748b] tracking-[0.15em] uppercase flex items-center gap-2">
          <StickyNote className="w-3.5 h-3.5" />Заметки судьи ({notes.length})
        </p>
        <button onClick={() => setShowForm(!showForm)} className="btn-ghost text-[11px] p-1">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onSubmit={addNote} className="mb-3 space-y-2 overflow-hidden"
          >
            <textarea className="input text-sm min-h-[60px] resize-none" placeholder="Заметка о матче..." value={text} onChange={e => setText(e.target.value)} required />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-xs py-2"><Plus className="w-3 h-3" />Добавить</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-xs py-2">Отмена</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-1.5">
        {notes.map(n => (
          <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
            className="flex items-start gap-2 p-2 rounded-lg bg-[#1a1a25] border border-[#2a2a3a]/30"
          >
            <p className="flex-1 text-sm text-[#94a3b8]">{n.text}</p>
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] text-[#475569]">{n.created}</p>
              <button onClick={() => deleteNote(n.id)} className="text-[#475569] hover:text-red-400 mt-0.5"><X className="w-3 h-3" /></button>
            </div>
          </motion.div>
        ))}
        {notes.length === 0 && <p className="text-[11px] text-[#475569] text-center py-3">Нет заметок</p>}
      </div>
    </div>
  )
}
