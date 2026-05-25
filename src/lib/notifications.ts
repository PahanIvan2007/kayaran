export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export function sendBrowserNotification(title: string, options?: NotificationOptions) {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  try {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    })
  } catch {
  }
}

const SUBSCRIPTION_KEY = 'kayaran_push_subscription'

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null

  try {
    const registration = await navigator.serviceWorker.register('/sw.js')
    return registration
  } catch {
    return null
  }
}

export function isSubscribed(): boolean {
  return !!localStorage.getItem(SUBSCRIPTION_KEY)
}

export function setSubscribed() {
  localStorage.setItem(SUBSCRIPTION_KEY, 'true')
}
