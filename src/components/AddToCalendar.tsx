import { Calendar, CalendarDays, Apple } from 'lucide-react'
import { openGoogleCalendar, openOutlookCalendar, openAppleCalendar, generateICS, downloadICS } from '../lib/calendar'

interface Props {
  title: string
  description?: string
  location?: string
  startDate: string
  endDate?: string
}

export default function AddToCalendar({ title, description, location, startDate, endDate }: Props) {
  const event = { title, description, location, startDate, endDate }

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => openGoogleCalendar(event)} className="btn-ghost text-[11px] px-3 py-2">
        <Calendar className="w-3.5 h-3.5" />Google
      </button>
      <button onClick={() => openOutlookCalendar(event)} className="btn-ghost text-[11px] px-3 py-2">
        <CalendarDays className="w-3.5 h-3.5" />Outlook
      </button>
      <button onClick={() => openAppleCalendar(event)} className="btn-ghost text-[11px] px-3 py-2">
        <Apple className="w-3.5 h-3.5" />Apple
      </button>
      <button onClick={() => {
        const ics = generateICS(event)
        downloadICS(ics, `${title.replace(/\s+/g, '_')}.ics`)
      }} className="btn-ghost text-[11px] px-3 py-2">
        <CalendarDays className="w-3.5 h-3.5" />.ICS
      </button>
    </div>
  )
}
