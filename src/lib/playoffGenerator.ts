import type { StandingsRow } from './standings'

export interface PlayoffMatch {
  round: number
  match: number
  teamA: string | null
  teamB: string | null
  teamAName?: string
  teamBName?: string
}

export function generatePlayoffBracket(standings: StandingsRow[]): PlayoffMatch[] {
  const sorted = [...standings].sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff)
  const top4 = sorted.slice(0, 4)

  if (top4.length < 4) return []

  const bracket: PlayoffMatch[] = [
    { round: 1, match: 1, teamA: top4[0].teamId, teamB: top4[3].teamId, teamAName: top4[0].teamName, teamBName: top4[3].teamName },
    { round: 1, match: 2, teamA: top4[1].teamId, teamB: top4[2].teamId, teamAName: top4[1].teamName, teamBName: top4[2].teamName },
  ]

  bracket.push({
    round: 2, match: 3,
    teamA: null, teamB: null,
    teamAName: 'Победитель 1', teamBName: 'Победитель 2'
  })

  return bracket
}
