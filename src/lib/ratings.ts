export interface TeamRating {
  teamId: string
  teamName: string
  rating: number
  matchesPlayed: number
}

const BASE_RATING = 1200
const K_FACTOR = 32

function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
}

export function calculateRatings(matches: any[], teams: any[]): TeamRating[] {
  const ratingMap = new Map<string, number>()

  for (const t of teams) {
    ratingMap.set(t.id, BASE_RATING)
  }

  for (const m of matches) {
    if (m.status !== 'finished') continue
    const aId = typeof m.team_a === 'object' ? m.team_a?.id : m.team_a
    const bId = typeof m.team_b === 'object' ? m.team_b?.id : m.team_b
    if (!aId || !bId) continue
    if (!ratingMap.has(aId) || !ratingMap.has(bId)) continue

    const ra = ratingMap.get(aId)!
    const rb = ratingMap.get(bId)!
    const ea = expectedScore(ra, rb)
    const eb = expectedScore(rb, ra)

    let sa: number, sb: number
    if (m.score_a > m.score_b) { sa = 1; sb = 0 }
    else if (m.score_a < m.score_b) { sa = 0; sb = 1 }
    else { sa = 0.5; sb = 0.5 }

    ratingMap.set(aId, ra + K_FACTOR * (sa - ea))
    ratingMap.set(bId, rb + K_FACTOR * (sb - eb))
  }

  const matchCountMap = new Map<string, number>()
  for (const m of matches) {
    if (m.status !== 'finished') continue
    const aId = typeof m.team_a === 'object' ? m.team_a?.id : m.team_a
    const bId = typeof m.team_b === 'object' ? m.team_b?.id : m.team_b
    matchCountMap.set(aId, (matchCountMap.get(aId) || 0) + 1)
    matchCountMap.set(bId, (matchCountMap.get(bId) || 0) + 1)
  }

  return teams.map((t: any) => ({
    teamId: t.id,
    teamName: t.name,
    rating: Math.round(ratingMap.get(t.id) || BASE_RATING),
    matchesPlayed: matchCountMap.get(t.id) || 0
  })).sort((a, b) => b.rating - a.rating)
}
