import { useState } from 'react'
import { api } from '../lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Upload, Trash2, FileSpreadsheet, Loader2 } from 'lucide-react'

export default function ExportImport() {
  const [open, setOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)

  const handleExportJSON = async () => {
    setExporting(true)
    const [tournaments, teams, matches] = await Promise.all([api.getTournaments(), api.getTeams(), api.getMatches()])
    const data = { exported_at: new Date().toISOString(), tournaments, teams, matches }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `kayaran-export-${Date.now()}.json`
    a.click(); URL.revokeObjectURL(url); setExporting(false)
  }

  const handleExportCSV = () => {
    setExporting(true)
    const rows = [['Название', 'Локация', 'Статус', 'Дата']]
    api.getTournaments().then(ts => {
      for (const t of ts) rows.push([t.title, t.location || '', t.status, t.created_at || ''])
      const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = `kayaran-tournaments-${Date.now()}.csv`
      a.click(); URL.revokeObjectURL(url); setExporting(false)
    })
  }

  const handleImportCSV = () => {
    const input = document.createElement('input')
    input.type = 'file'; input.accept = '.csv'
    input.onchange = async (e: any) => {
      setImporting(true)
      const file = e.target.files?.[0]
      if (!file) return
      const text = await file.text()
      const lines = text.split('\n').slice(1).filter(Boolean)
      for (const line of lines) {
        const parts = line.split(',').map((s: string) => s.replace(/^"|"$/g, '').trim())
        if (parts[0]) await api.createTournament({ title: parts[0], location: parts[1] || null, status: parts[2] || 'draft' })
      }
      setImporting(false); window.location.reload()
    }
    input.click()
  }

  const handleReset = async () => {
    if (!confirm('Удалить ВСЕ данные? Это необратимо.')) return
    if (!confirm('Вы уверены? Все турниры, матчи, команды будут удалены.')) return
    localStorage.removeItem('kayaran_local_data')
    localStorage.removeItem('kayaran_seeded')
    window.location.reload()
  }

  return (
    <div>
      <button onClick={() => setOpen(!open)} className="btn-ghost text-xs"><Download className="w-3 h-3" />Экспорт</button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="glass-card p-4 space-y-3"
          >
            <p className="text-[11px] text-[#64748b] tracking-[0.15em] uppercase"><Download className="w-3 h-3 inline" /> Экспорт / Импорт</p>

            <div className="flex flex-wrap gap-2">
              <button onClick={handleExportJSON} disabled={exporting} className="btn-cyber text-xs">
                {exporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}JSON
              </button>
              <button onClick={handleExportCSV} disabled={exporting} className="btn-cyber text-xs">
                <FileSpreadsheet className="w-3 h-3" />CSV
              </button>
              <button onClick={handleImportCSV} disabled={importing} className="btn-cyber text-xs">
                {importing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}Импорт CSV
              </button>
            </div>

            <div className="pt-2 border-t border-[#2a2a3a]/50">
              <button onClick={handleReset} className="btn-ghost text-xs text-red-400 hover:text-red-300">
                <Trash2 className="w-3 h-3" />Сбросить все данные
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
