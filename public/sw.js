const CACHE = 'kayaran-v1'

self.addEventListener('install', (e) => {
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim())
})

self.addEventListener('push', (e) => {
  const data = e.data?.json() || {}
  const title = data.title || 'Каяран'
  const options = {
    body: data.body || '',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    data: data.url ? { url: data.url } : undefined
  }

  e.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  if (e.notification.data?.url) {
    e.waitUntil(clients.openWindow(e.notification.data.url))
  }
})
