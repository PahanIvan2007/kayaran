export interface PlayerStat {
  playerName: string
  teamId: string
  teamName: string
  goals: number
  matchesPlayed: number
  yellowCards: number
  redCards: number
}

export function calculatePlayerStats(matches: any[], teams: any[]): PlayerStat[] {
  const statsMap = new Map<string, PlayerStat>()

  const getTeamName = (id: string) => teams.find((t: any) => t.id === id)?.name || 'Unknown'

  for (const match of matches) {
    if (match.status !== 'finished') continue
    const teamAId = typeof match.team_a === 'object' ? match.team_a?.id : match.team_a
    const teamBId = typeof match.team_b === 'object' ? match.team_b?.id : match.team_b

    const eventsA = match.events?.filter((e: any) => e.team_id === teamAId) || []
    const eventsB = match.events?.filter((e: any) => e.team_id === teamBId) || []

    const allEvents = [...eventsA, ...eventsB]
    for (const event of allEvents) {
      const playerName = event.player_name || 'Unknown'
      const teamId = event.team_id === teamAId ? teamAId : teamBId
      const key = `${playerName}-${teamId}`

      if (!statsMap.has(key)) {
        statsMap.set(key, {
          playerName,
          teamId,
          teamName: getTeamName(teamId),
          goals: 0,
          matchesPlayed: 0,
          yellowCards: 0,
          redCards: 0
        })
      }

      const stat = statsMap.get(key)!
      if (event.type === 'goal') stat.goals++
      if (event.type === 'yellow_card') stat.yellowCards++
      if (event.type === 'red_card') stat.redCards++
    }
  }

  const matchPlayedMap = new Map<string, Set<string>>()
  for (const match of matches) {
    if (match.status !== 'finished') continue
    const teamAId = typeof match.team_a === 'object' ? match.team_a?.id : match.team_a
    const teamBId = typeof match.team_b === 'object' ? match.team_b?.id : match.team_b
    const events = match.events || []
    for (const event of events) {
      const playerName = event.player_name || 'Unknown'
      const teamId = event.team_id === teamAId ? teamAId : teamBId
      const key = `${playerName}-${teamId}`
      if (!matchPlayedMap.has(key)) matchPlayedMap.set(key, new Set())
      matchPlayedMap.get(key)!.add(match.id)
    }
  }

  for (const [key, matchSet] of matchPlayedMap) {
    const stat = statsMap.get(key)
    if (stat) stat.matchesPlayed = matchSet.size
  }

  const matchScorers = new Map<string, Set<string>>()
  for (const match of matches) {
    if (match.status !== 'finished') continue
    const teamAId = typeof match.team_a === 'object' ? match.team_a?.id : match.team_a
    const teamBId = typeof match.team_b === 'object' ? match.team_b?.id : match.team_b
    const allEvts = match.events || []
    for (const event of allEvts) {
      if (event.type === 'goal') {
        const playerName = event.player_name || 'Unknown'
        const teamId = event.team_id === teamAId ? teamAId : teamBId
        const key = `${playerName}-${teamId}`
        if (!matchScorers.has(key)) matchScorers.set(key, new Set())
        matchScorers.get(key)!.add(match.id)
      }
    }
  }

  for (const [key, matchSet] of matchScorers) {
    const stat = statsMap.get(key)
    if (stat && stat.matchesPlayed === 0) stat.matchesPlayed = matchSet.size
  }

  return Array.from(statsMap.values()).sort((a, b) => b.goals - a.goals)
}
