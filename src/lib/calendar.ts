export function generateICS(event: {
  title: string
  description?: string
  location?: string
  startDate: string
  endDate?: string
}): string {
  const formatICS = (d: string) => {
    const dt = new Date(d)
    return dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const start = formatICS(event.startDate)
  const end = event.endDate ? formatICS(event.endDate) : formatICS(event.startDate)

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kayaran//Tournament//RU',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    event.description ? `DESCRIPTION:${event.description}` : '',
    event.location ? `LOCATION:${event.location}` : '',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n')
}

export function downloadICS(ics: string, filename: string) {
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function openGoogleCalendar(event: { title: string; description?: string; location?: string; startDate: string; endDate?: string }) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description || '',
    location: event.location || '',
    dates: `${new Date(event.startDate).toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${(event.endDate ? new Date(event.endDate) : new Date(event.startDate)).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`
  })
  window.open(`https://calendar.google.com/calendar/render?${params}`, '_blank')
}

export function openOutlookCalendar(event: { title: string; description?: string; location?: string; startDate: string; endDate?: string }) {
  const params = new URLSearchParams({
    rru: 'addevent',
    summary: event.title,
    description: event.description || '',
    location: event.location || '',
    startdt: new Date(event.startDate).toISOString(),
    enddt: (event.endDate ? new Date(event.endDate) : new Date(event.startDate)).toISOString()
  })
  window.open(`https://outlook.live.com/calendar/0/deeplink/compose?${params}`, '_blank')
}

export function openAppleCalendar(event: { title: string; description?: string; location?: string; startDate: string; endDate?: string }) {
  const ics = generateICS(event)
  downloadICS(ics, `${event.title.replace(/\s+/g, '_')}.ics`)
}
