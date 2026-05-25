import { MapPin } from 'lucide-react'

interface Props {
  locations: { name: string; address?: string; lat?: number; lng?: number }[]
  center?: { lat: number; lng: number }
}

export default function MapView({ locations }: Props) {
  const hasCoords = locations.some(l => l.lat && l.lng)

  if (hasCoords) {
    return (
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-[#a78bfa]" />
          <span className="text-xs text-[#64748b] tracking-[0.15em] uppercase">Карта</span>
        </div>
        <div className="rounded-xl overflow-hidden bg-[#1a1a25] h-[200px] flex items-center justify-center">
          {locations.map((l, i) => (
            <div key={i} className="text-center px-4">
              <MapPin className="w-6 h-6 text-[#a78bfa] mx-auto mb-1" />
              <p className="text-sm text-[#cbd5e1]">{l.name}</p>
              {l.address && <p className="text-[11px] text-[#475569]">{l.address}</p>}
              {l.lat && l.lng && (
                <a href={`https://www.google.com/maps?q=${l.lat},${l.lng}`} target="_blank" rel="noopener noreferrer"
                  className="btn-ghost text-[10px] mt-2"
                >
                  <MapPin className="w-3 h-3" />Открыть в Google Maps
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (locations.length === 0) return null

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-[#a78bfa]" />
        <span className="text-xs text-[#64748b] tracking-[0.15em] uppercase">Локация</span>
      </div>
      <div className="space-y-2">
        {locations.map((l, i) => (
          <div key={i} className="flex items-center gap-3 bg-[#1a1a25] rounded-xl p-3">
            <MapPin className="w-5 h-5 text-[#a78bfa] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#cbd5e1] truncate">{l.name}</p>
              {l.address && <p className="text-[11px] text-[#475569] truncate">{l.address}</p>}
            </div>
            <a href={`https://www.google.com/maps/search/${encodeURIComponent(l.address || l.name)}`}
              target="_blank" rel="noopener noreferrer" className="btn-ghost text-[10px] px-3 py-1.5"
            >
              <MapPin className="w-3 h-3" />Maps
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
