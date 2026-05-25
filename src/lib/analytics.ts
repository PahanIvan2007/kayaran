export function createAnalytics() {
  const queue: Record<string, any>[] = []
  let enabled = true

  function track(event: string, data?: Record<string, any>) {
    if (!enabled) return
    const entry = { event, data, timestamp: new Date().toISOString(), url: window.location.href }
    queue.push(entry)

    if (queue.length > 50) queue.shift()
    localStorage.setItem('kayaran_analytics', JSON.stringify(queue.slice(-100)))

    if (typeof (window as any).gtag === 'function') {
      try { (window as any).gtag('event', event, data) } catch {}
    }
  }

  function pageView(path: string) {
    track('page_view', { path })
    if (typeof (window as any).gtag === 'function') {
      try { (window as any).gtag('config', 'G-XXXXXXXXXX', { page_path: path }) } catch {}
    }
  }

  function getEvents() {
    try {
      return JSON.parse(localStorage.getItem('kayaran_analytics') || '[]')
    } catch { return [] }
  }

  return { track, pageView, getEvents, setEnabled: (v: boolean) => { enabled = v } }
}

export const analytics = createAnalytics()
