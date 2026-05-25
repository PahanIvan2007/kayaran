// Feature 12: Emote reactions on matches
import { useState } from 'react'
import { motion } from 'framer-motion'

const emojis = ['🔥', '⚡', '💪', '👏', '🎯', '😱', '🤯', '🥶', '👀', '💀']

interface Props { matchId: string }

export default function Reactions({ matchId: _matchId }: Props) {
  const [reactions, setReactions] = useState<Record<string, number>>({})

  const addReaction = (emoji: string) => {
    setReactions(prev => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }))
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {emojis.map(emoji => (
        <motion.button
          key={emoji}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => addReaction(emoji)}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm transition-all ${
            reactions[emoji] ? 'bg-[#8b5cf6]/15 border border-[#8b5cf6]/20' : 'bg-[#1a1a25] border border-[#2a2a3a] hover:border-[#475569]'
          }`}
        >
          <span>{emoji}</span>
          {reactions[emoji] && <span className="text-[11px] text-[#a78bfa] font-medium">{reactions[emoji]}</span>}
        </motion.button>
      ))}
    </div>
  )
}
