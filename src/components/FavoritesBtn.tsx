// Feature 13: Bookmark/favorite tournaments
import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props { tournamentId: string }

const FAV_KEY = 'kayaran_favorites'

function getFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]') } catch { return [] }
}

export default function FavoritesBtn({ tournamentId }: Props) {
  const [isFav, setIsFav] = useState(false)

  useEffect(() => { setIsFav(getFavorites().includes(tournamentId)) }, [tournamentId])

  const toggle = () => {
    const favs = getFavorites()
    if (favs.includes(tournamentId)) {
      localStorage.setItem(FAV_KEY, JSON.stringify(favs.filter(id => id !== tournamentId)))
      setIsFav(false)
    } else {
      localStorage.setItem(FAV_KEY, JSON.stringify([...favs, tournamentId]))
      setIsFav(true)
    }
  }

  return (
    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
      onClick={e => { e.stopPropagation(); toggle() }}
      className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
    >
      <Heart className={`w-4 h-4 transition-colors ${isFav ? 'text-red-400 fill-red-400' : 'text-[#475569]'}`} />
    </motion.button>
  )
}
