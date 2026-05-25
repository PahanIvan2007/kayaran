// Feature 14: Export tournament data to JSON
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, CheckCircle2 } from 'lucide-react'

interface ExportData {
  tournament: any
  matches: any[]
  teams: any[]
  standings: any[]
}

interface Props { data: ExportData }

export default function ExportData({ data }: Props) {
  const [copied, setCopied] = useState<'json' | null>(null)

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `kayaran-export-${Date.now()}.json`; a.click()
    URL.revokeObjectURL(url)
    setCopied('json'); setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex gap-2">
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={exportJSON} className="btn-ghost text-xs"
      >
        <AnimatePresence mode="wait">
          {copied === 'json' ? (
            <motion.span key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-emerald-400"
            ><CheckCircle2 className="w-3.5 h-3.5" />Готово</motion.span>
          ) : (
            <motion.span key="export" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-1.5"
            ><Download className="w-3.5 h-3.5" />Экспорт</motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
