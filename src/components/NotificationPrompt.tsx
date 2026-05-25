import { useState, useEffect } from 'react'
import { requestNotificationPermission, isSubscribed, setSubscribed, sendBrowserNotification } from '../lib/notifications'
import { Bell, BellOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function NotificationPrompt() {
  const [enabled, setEnabled] = useState(isSubscribed)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!enabled && 'Notification' in window && Notification.permission === 'default') {
      const timer = setTimeout(() => setShow(true), 5000)
      return () => clearTimeout(timer)
    }
  }, [enabled])

  const handleEnable = async () => {
    const granted = await requestNotificationPermission()
    if (granted) {
      setEnabled(true)
      setSubscribed()
      setShow(false)
      sendBrowserNotification('Каяран', { body: 'Уведомления включены!' })
    }
  }

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 glass-card p-4 max-w-xs"
          >
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-[#a78bfa] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#cbd5e1]">Включить уведомления?</p>
                <p className="text-[11px] text-[#475569] mt-1">Получайте оповещения о голах и событиях матчей</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={handleEnable} className="btn-primary text-xs !px-4 !py-2">
                    <Bell className="w-3 h-3" />Включить
                  </button>
                  <button onClick={() => setShow(false)} className="btn-ghost text-xs !px-4 !py-2">
                    Нет
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {enabled && (
        <button
          onClick={() => {
            setEnabled(false)
            localStorage.removeItem('kayaran_push_subscription')
          }}
          className="btn-ghost text-xs"
          title="Отключить уведомления"
        >
          <BellOff className="w-3 h-3" />
        </button>
      )}
    </>
  )
}
