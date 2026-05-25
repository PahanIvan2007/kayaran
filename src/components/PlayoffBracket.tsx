import { useState } from 'react'
import { generatePlayoffBracket, type PlayoffMatch } from '../lib/playoffGenerator'
import type { StandingsRow } from '../lib/standings'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Swords, ChevronRight } from 'lucide-react'

interface Props {
  standings: StandingsRow[]
  onGenerate?: (bracket: PlayoffMatch[]) => void
}

export default function PlayoffBracket({ standings, onGenerate }: Props) {
  const [bracket, setBracket] = useState<PlayoffMatch[] | null>(null)

  const handleGenerate = () => {
    const b = generatePlayoffBracket(standings)
    setBracket(b)
    if (onGenerate) onGenerate(b)
  }

  const canGenerate = standings.length >= 4

  return (
    <div className="glass-card p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4 px-2">
        <Trophy className="w-4 h-4 text-[#a78bfa]" />
        <span className="text-xs text-[#64748b] tracking-[0.15em] uppercase">Плей-офф</span>
      </div>

      {!bracket ? (
        <div className="text-center py-6 sm:py-10">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 bg-[#1a1a25] border border-[#2a2a3a]">
            <Swords className="w-7 h-7 text-[#2a2a3a]" />
          </div>
          {canGenerate ? (
            <>
              <p className="text-sm text-[#64748b] mb-4">Сетка плей-офф по текущей таблице</p>
              <button onClick={handleGenerate} className="btn-primary">
                <Trophy className="w-4 h-4" />Сгенерировать
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-[#64748b]">Нужно минимум 4 команды</p>
              <p className="text-[11px] text-[#475569] mt-1">Сейчас: {standings.length}</p>
            </>
          )}
        </div>
      ) : (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 sm:space-y-0 sm:flex sm:items-center sm:gap-4 sm:overflow-x-auto sm:pb-4">
            {[1, 2].map(round => {
              const matches = bracket.filter(m => m.round === round)
              return (
                <div key={round} className="sm:flex-1 min-w-[220px]">
                  <p className="text-[11px] text-[#475569] uppercase tracking-wider mb-3 px-1">
                    {round === 1 ? 'Полуфиналы' : 'Финал'}
                  </p>
                  <div className="space-y-2 relative">
                    {round === 2 && (
                      <div className="hidden sm:flex items-center justify-center -mt-8 mb-2">
                        <ChevronRight className="w-5 h-5 text-[#8b5cf6]/40" />
                      </div>
                    )}
                    {matches.map((m, i) => (
                      <motion.div key={m.match}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative"
                      >
                        <div className="bg-[#1a1a25] border border-[#2a2a3a] rounded-xl p-3 sm:p-4 hover:border-[#8b5cf6]/30 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className={`flex-1 text-sm font-medium truncate ${round === 2 ? 'text-[#a78bfa]' : 'text-[#cbd5e1]'}`}>
                              {round === 1 ? m.teamAName : m.teamAName || 'TBD'}
                            </span>
                            {round === 1 && (
                              <span className="text-[#2a2a3a] text-xs">VS</span>
                            )}
                            <span className={`flex-1 text-sm font-medium text-right truncate ${round === 2 ? 'text-[#a78bfa]' : 'text-[#cbd5e1]'}`}>
                              {round === 1 ? m.teamBName : m.teamBName || 'TBD'}
                            </span>
                          </div>
                        </div>
                        {/* Connector line */}
                        {round === 1 && i === 0 && (
                          <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-px bg-[#8b5cf6]/20" />
                        )}
                        {round === 1 && i === 1 && (
                          <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-px bg-[#8b5cf6]/20" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            })}
            <div className="sm:flex-none text-center pt-4 sm:pt-0">
              <button onClick={() => setBracket(null)} className="btn-ghost text-xs">
                Сбросить
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
