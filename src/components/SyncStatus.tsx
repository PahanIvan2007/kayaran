import { useState, useEffect } from 'react'
import { Wifi, WifiOff, Clock, HardDrive } from 'lucide-react'

export default function SyncStatus() {
  const [online, setOnline] = useState(navigator.onLine)
  const [lastSync, setLastSync] = useState<string | null>(localStorage.getItem('kayaran_last_sync'))
  const [storageSize, setStorageSize] = useState('')

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const interval = setInterval(() => {
      setLastSync(localStorage.getItem('kayaran_last_sync'))
      try {
        const data = localStorage.getItem('kayaran_local_data')
        const size = data ? new Blob([data]).size : 0
        setStorageSize(size > 1024 ? `${(size / 1024).toFixed(1)} KB` : `${size} B`)
      } catch { setStorageSize('--') }
    }, 5000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="flex items-center gap-3 text-[10px] text-[#475569]">
      <span className="flex items-center gap-1">
        {online ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-red-400" />}
        {online ? 'Online' : 'Offline'}
      </span>
      <span className="flex items-center gap-1">
        <HardDrive className="w-3 h-3" />
        {storageSize || '--'}
      </span>
      {lastSync && (
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(lastSync).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  )
}

export function updateLastSync() {
  localStorage.setItem('kayaran_last_sync', new Date().toISOString())
}
