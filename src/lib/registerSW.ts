export async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('ServiceWorker registered:', registration)
    } catch (error) {
      console.error('ServiceWorker registration failed:', error)
    }
  }
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}
