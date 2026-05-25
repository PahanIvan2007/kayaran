import { useState } from 'react'
import { api } from '../lib/api'
import { generateXLSX, downloadXLSX } from '../lib/xlsx'
import { FileSpreadsheet, Loader2 } from 'lucide-react'

export default function ExcelExport() {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    const [tournaments, teams, matches] = await Promise.all([
      api.getTournaments(), api.getTeams(), api.getMatches()
    ])

    const sheets = [
      {
        name: 'Турниры',
        headers: ['Название', 'Локация', 'Статус', 'Дата создания'],
        rows: tournaments.map((t: any) => [t.title, t.location || '', t.status, t.created_at || ''])
      },
      {
        name: 'Команды',
        headers: ['Название', 'Цвет'],
        rows: teams.map((t: any) => [t.name, t.color || ''])
      },
      {
        name: 'Матчи',
        headers: ['Команда A', 'Команда B', 'Счёт A', 'Счёт B', 'Статус', 'Поле'],
        rows: matches.map((m: any) => [
          typeof m.team_a === 'object' ? m.team_a?.name : m.team_a || '',
          typeof m.team_b === 'object' ? m.team_b?.name : m.team_b || '',
          String(m.score_a), String(m.score_b), m.status, m.field_name || ''
        ])
      }
    ]

    const blob = generateXLSX({ sheets })
    downloadXLSX(blob, `kayaran-${Date.now()}.xlsx`)
    setLoading(false)
  }

  return (
    <button onClick={handleExport} disabled={loading} className="btn-cyber text-xs">
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileSpreadsheet className="w-3 h-3" />}
      Excel .xlsx
    </button>
  )
}
