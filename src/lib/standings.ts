// Feature 10: Standings calculator
export interface StandingsRow {
  teamId: string
  teamName: string
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDiff: number
  points: number
}

export function calculateStandings(matches: any[], teams: any[]): StandingsRow[] {
  const map = new Map<string, StandingsRow>()

  for (const t of teams) {
    map.set(t.id, {
      teamId: t.id, teamName: t.name,
      played: 0, wins: 0, draws: 0, losses: 0,
      goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0
    })
  }

  for (const m of matches) {
    if (m.status !== 'finished') continue
    const aId = typeof m.team_a === 'object' ? m.team_a?.id : m.team_a
    const bId = typeof m.team_b === 'object' ? m.team_b?.id : m.team_b
    const a = map.get(aId); const b = map.get(bId)
    if (!a || !b) continue

    a.played++; b.played++
    a.goalsFor += m.score_a; a.goalsAgainst += m.score_b
    b.goalsFor += m.score_b; b.goalsAgainst += m.score_a

    if (m.score_a > m.score_b) { a.wins++; b.losses++; a.points += 3 }
    else if (m.score_a < m.score_b) { b.wins++; a.losses++; b.points += 3 }
    else { a.draws++; b.draws++; a.points++; b.points++ }

    a.goalDiff = a.goalsFor - a.goalsAgainst
    b.goalDiff = b.goalsFor - b.goalsAgainst
  }

  return Array.from(map.values()).sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff)
}
