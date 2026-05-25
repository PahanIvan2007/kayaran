// Feature 4: Search & filter tournaments
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = 'Поиск...' }: Props) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
      <input
        className="input pl-10 pr-10 text-sm"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#e2e8f0]"
          ><X className="w-4 h-4" /></motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
