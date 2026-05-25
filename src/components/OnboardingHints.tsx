import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, Keyboard, X } from 'lucide-react'

const HINTS = [
  { key: 'T', desc: 'Создать турнир' },
  { key: 'M', desc: 'Добавить матч' },
  { key: 'Escape', desc: 'Закрыть модалку' },
  { key: 'F', desc: 'Полный экран' },
  { key: '?', desc: 'Показать подсказки' },
]

export default function OnboardingHints() {
  const [show, setShow] = useState(() => !localStorage.getItem('kayaran_hints_dismissed'))
  const [hintsOpen, setHintsOpen] = useState(false)

  useEffect(() => {
    if (!show) return
    const timer = setTimeout(() => setShow(false), 8000)
    return () => clearTimeout(timer)
  }, [show])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '?') setHintsOpen(o => !o)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const dismiss = () => {
    setShow(false)
    localStorage.setItem('kayaran_hints_dismissed', 'true')
  }

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-6 z-50 glass-card p-4 max-w-xs"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#cbd5e1]">Подсказка</p>
                <p className="text-[11px] text-[#475569] mt-1">Нажмите <kbd className="px-1 py-0.5 bg-[#1a1a25] rounded text-[10px]">?</kbd> для списка горячих клавиш</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => { setHintsOpen(true); setShow(false) }} className="text-xs text-[#a78bfa] hover:underline">Показать</button>
                  <button onClick={dismiss} className="text-xs text-[#475569] hover:underline">Понятно</button>
                </div>
              </div>
              <button onClick={dismiss} className="p-1 text-[#475569]"><X className="w-3 h-3" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hintsOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setHintsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="glass-card p-6 max-w-sm w-full mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-[#cbd5e1]"><Keyboard className="w-4 h-4 inline" /> Горячие клавиши</span>
                <button onClick={() => setHintsOpen(false)} className="p-1 text-[#475569] hover:text-[#e2e8f0]"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2">
                {HINTS.map(h => (
                  <div key={h.key} className="flex items-center justify-between">
                    <kbd className="px-2 py-1 bg-[#1a1a25] border border-[#2a2a3a] rounded text-xs font-mono text-[#a78bfa]">{h.key}</kbd>
                    <span className="text-xs text-[#64748b]">{h.desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
