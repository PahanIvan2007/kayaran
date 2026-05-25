import { motion } from 'framer-motion'

export function CardSkeleton() {
  return (
    <div className="card p-5 space-y-3 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-[#2a2a3a]" />
      <div className="h-4 bg-[#2a2a3a] rounded w-2/3" />
      <div className="h-3 bg-[#2a2a3a] rounded w-1/3" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
          className="card p-4 flex items-center gap-4 animate-pulse"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2a2a3a]" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-[#2a2a3a] rounded w-1/3" />
            <div className="h-3 bg-[#2a2a3a] rounded w-1/4" />
          </div>
          <div className="w-16 h-8 bg-[#2a2a3a] rounded" />
        </motion.div>
      ))}
    </div>
  )
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-4 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-[#2a2a3a] mb-3" />
          <div className="h-5 bg-[#2a2a3a] rounded w-12 mb-2" />
          <div className="h-3 bg-[#2a2a3a] rounded w-16" />
        </div>
      ))}
    </div>
  )
}
