import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Maximize2, Minimize2, Languages, Palette, GripHorizontal } from 'lucide-react'

const ACCENTS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#f97316']

export default function SettingsPanel() {
  const [open, setOpen] = useState(false)
  const [compact, setCompact] = useState(() => localStorage.getItem('kayaran_compact') === 'true')
  const [accent, setAccent] = useState(() => localStorage.getItem('kayaran_accent') || '#8b5cf6')
  const [fullscreen, setFullscreen] = useState(false)
  const [lang, setLang] = useState(() => localStorage.getItem('kayaran_lang') || 'ru')

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent)
    localStorage.setItem('kayaran_accent', accent)
  }, [accent])

  useEffect(() => {
    localStorage.setItem('kayaran_compact', String(compact))
    document.documentElement.classList.toggle('compact', compact)
  }, [compact])

  useEffect(() => {
    localStorage.setItem('kayaran_lang', lang)
  }, [lang])

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      setFullscreen(true)
    } else {
      await document.exitFullscreen()
      setFullscreen(false)
    }
  }

  return (
    <>
      <button onClick={() => setOpen(!open)} className="btn-ghost text-xs">
        <Settings className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="glass-card p-4 space-y-4"
          >
            <p className="text-xs text-[#64748b] tracking-[0.15em] uppercase"><Settings className="w-3 h-3 inline" /> Настройки</p>

            <div>
              <p className="text-[11px] text-[#475569] mb-2"><Palette className="w-3 h-3 inline" /> Акцентный цвет</p>
              <div className="flex gap-2">
                {ACCENTS.map(c => (
                  <button key={c} onClick={() => setAccent(c)}
                    className="w-7 h-7 rounded-lg border-2 transition-all"
                    style={{ backgroundColor: c, borderColor: accent === c ? '#fff' : 'transparent' }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#cbd5e1]"><GripHorizontal className="w-3.5 h-3.5 inline" /> Компактный режим</span>
              <button onClick={() => setCompact(!compact)} className={`w-10 h-5 rounded-full transition-colors ${compact ? 'bg-[#8b5cf6]' : 'bg-[#2a2a3a]'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${compact ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#cbd5e1]"><Languages className="w-3.5 h-3.5 inline" /> Язык</span>
              <select className="text-sm bg-[#1a1a25] border border-[#2a2a3a] rounded-lg px-3 py-1.5 text-[#cbd5e1]" value={lang} onChange={e => setLang(e.target.value)}>
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#cbd5e1]"><Maximize2 className="w-3.5 h-3.5 inline" /> Полный экран</span>
              <button onClick={toggleFullscreen} className="btn-ghost text-xs">
                {fullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
