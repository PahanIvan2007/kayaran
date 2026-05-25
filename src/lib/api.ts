import { supabase } from './supabase'

const LOCAL_KEY = 'kayaran_local_data'

interface LocalData {
  tournaments: any[]
  teams: any[]
  matches: any[]
  matchEvents: any[]
  players: any[]
}

function getLocal(): LocalData {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null') || {
      tournaments: [], teams: [], matches: [], matchEvents: [], players: []
    }
  } catch {
    return { tournaments: [], teams: [], matches: [], matchEvents: [], players: [] }
  }
}

function saveLocal(data: LocalData) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
}

function tryCatch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  return fn().catch(() => fallback)
}

function uid() {
  return crypto.randomUUID?.() || Math.random().toString(36).slice(2)
}

export const api = {
  async getTournaments() {
    return tryCatch(async () => {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      const list = data || []
      const local = getLocal()
      saveLocal({ ...local, tournaments: list })
      return list
    }, getLocal().tournaments)
  },

  async getTournament(id: string) {
    const local = getLocal()
    const cached = local.tournaments.find((t: any) => t.id === id)
    return tryCatch(async () => {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    }, cached || null)
  },

  async createTournament(tournament: Record<string, unknown>) {
    const localId = uid()
    const localTournament = { id: localId, ...tournament, created_at: new Date().toISOString() }
    const local = getLocal()
    saveLocal({ ...local, tournaments: [localTournament, ...local.tournaments] })
    return tryCatch(async () => {
      const { data, error } = await supabase
        .from('tournaments')
        .insert(tournament as never)
        .select()
        .single()
      if (error) throw error
      const local2 = getLocal()
      saveLocal({
        ...local2,
        tournaments: local2.tournaments.map((t: any) => t.id === localId ? data : t)
      })
      return data
    }, localTournament)
  },

  async getTeams() {
    return tryCatch(async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name')
      if (error) throw error
      const list = data || []
      const local = getLocal()
      saveLocal({ ...local, teams: list })
      return list
    }, getLocal().teams)
  },

  async createTeam(team: Record<string, unknown>) {
    const localId = uid()
    const localTeam = { id: localId, ...team, created_at: new Date().toISOString() }
    const local = getLocal()
    saveLocal({ ...local, teams: [...local.teams, localTeam] })
    return tryCatch(async () => {
      const { data, error } = await supabase
        .from('teams')
        .insert(team as never)
        .select()
        .single()
      if (error) throw error
      const local2 = getLocal()
      saveLocal({
        ...local2,
        teams: local2.teams.map((t: any) => t.id === localId ? data : t)
      })
      return data
    }, localTeam)
  },

  async getMatches(tournamentId?: string) {
    return tryCatch(async () => {
      let query = supabase
        .from('matches')
        .select('*, team_a:team_a(*), team_b:team_b(*)')
      if (tournamentId) query = query.eq('tournament_id', tournamentId)
      const { data, error } = await query.order('starts_at', { ascending: true })
      if (error) throw error
      const list = data || []
      const local = getLocal()
      const filtered = tournamentId
        ? list.filter((m: any) => m.tournament_id === tournamentId)
        : list
      saveLocal({ ...local, matches: filtered })
      return filtered
    }, getLocal().matches.filter((m: any) => !tournamentId || m.tournament_id === tournamentId))
  },

  async createMatch(match: Record<string, unknown>) {
    const localId = uid()
    const localMatch = { id: localId, ...match, created_at: new Date().toISOString() }
    const local = getLocal()
    saveLocal({ ...local, matches: [...local.matches, localMatch] })
    return tryCatch(async () => {
      const { data, error } = await supabase
        .from('matches')
        .insert(match as never)
        .select()
        .single()
      if (error) throw error
      const local2 = getLocal()
      saveLocal({
        ...local2,
        matches: local2.matches.map((m: any) => m.id === localId ? data : m)
      })
      return data
    }, localMatch)
  },

  async deleteMatch(matchId: string) {
    const local = getLocal()
    saveLocal({ ...local, matches: local.matches.filter((m: any) => m.id !== matchId) })
    return tryCatch(async () => {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchId)
      if (error) throw error
    }, undefined)
  },

  async updateMatchScore(matchId: string, scoreA: number, scoreB: number) {
    const local = getLocal()
    saveLocal({
      ...local,
      matches: local.matches.map((m: any) =>
        m.id === matchId ? { ...m, score_a: scoreA, score_b: scoreB } : m
      )
    })
    return tryCatch(async () => {
      const { error } = await supabase
        .from('matches')
        .update({ score_a: scoreA, score_b: scoreB } as never)
        .eq('id', matchId)
      if (error) throw error
    }, undefined)
  },

  async updateMatchStatus(matchId: string, status: string) {
    const local = getLocal()
    saveLocal({
      ...local,
      matches: local.matches.map((m: any) =>
        m.id === matchId ? { ...m, status } : m
      )
    })
    return tryCatch(async () => {
      const { error } = await supabase
        .from('matches')
        .update({ status } as never)
        .eq('id', matchId)
      if (error) throw error
    }, undefined)
  },

  async getMatchEvents(matchId: string) {
    return tryCatch(async () => {
      const { data, error } = await supabase
        .from('match_events')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data || []
    }, getLocal().matchEvents.filter((e: any) => e.match_id === matchId))
  },

  async createMatchEvent(event: Record<string, unknown>) {
    const localId = uid()
    const localEvent = { id: localId, ...event, created_at: new Date().toISOString() }
    const local = getLocal()
    saveLocal({ ...local, matchEvents: [...local.matchEvents, localEvent] })
    return tryCatch(async () => {
      const { data, error } = await supabase
        .from('match_events')
        .insert(event as never)
        .select()
        .single()
      if (error) throw error
      return data
    }, localEvent)
  },

  async updateTournament(id: string, data: Record<string, unknown>) {
    const local = getLocal()
    saveLocal({ ...local, tournaments: local.tournaments.map((t: any) => t.id === id ? { ...t, ...data } : t) })
    return tryCatch(async () => {
      const { error } = await supabase.from('tournaments').update(data as never).eq('id', id)
      if (error) throw error
    }, undefined)
  },

  async deleteTournament(id: string) {
    const local = getLocal()
    saveLocal({ ...local, tournaments: local.tournaments.filter((t: any) => t.id !== id), matches: local.matches.filter((m: any) => m.tournament_id !== id) })
    return tryCatch(async () => {
      await supabase.from('matches').delete().eq('tournament_id', id)
      await supabase.from('tournaments').delete().eq('id', id)
    }, undefined)
  },

  async updateTeam(id: string, data: Record<string, unknown>) {
    const local = getLocal()
    saveLocal({ ...local, teams: local.teams.map((t: any) => t.id === id ? { ...t, ...data } : t) })
    return tryCatch(async () => {
      const { error } = await supabase.from('teams').update(data as never).eq('id', id)
      if (error) throw error
    }, undefined)
  },

  async deleteTeam(id: string) {
    const local = getLocal()
    saveLocal({ ...local, teams: local.teams.filter((t: any) => t.id !== id) })
    return tryCatch(async () => {
      await supabase.from('teams').delete().eq('id', id)
    }, undefined)
  },

  async updateMatch(id: string, data: Record<string, unknown>) {
    const local = getLocal()
    saveLocal({ ...local, matches: local.matches.map((m: any) => m.id === id ? { ...m, ...data } : m) })
    return tryCatch(async () => {
      const { error } = await supabase.from('matches').update(data as never).eq('id', id)
      if (error) throw error
    }, undefined)
  },

  async cancelMatch(id: string) {
    return api.updateMatch(id, { status: 'cancelled' })
  },

  async getPlayers() {
    return tryCatch(async () => {
      const { data, error } = await supabase.from('players').select('*').order('name')
      if (error) throw error; return data || []
    }, getLocal().players || [])
  },

  async createPlayer(player: Record<string, unknown>) {
    const localId = uid()
    const localPlayer = { id: localId, ...player, created_at: new Date().toISOString() }
    const local = getLocal()
    const players = local.players || []
    saveLocal({ ...local, players: [...players, localPlayer] })
    return tryCatch(async () => {
      const { data, error } = await supabase.from('players').insert(player as never).select().single()
      if (error) throw error
      const l2 = getLocal(); const p2 = l2.players || []
      saveLocal({ ...l2, players: p2.map((p: any) => p.id === localId ? data : p) })
      return data
    }, localPlayer)
  },

  async updatePlayer(id: string, data: Record<string, unknown>) {
    const local = getLocal(); const players = local.players || []
    saveLocal({ ...local, players: players.map((p: any) => p.id === id ? { ...p, ...data } : p) })
    return tryCatch(async () => {
      const { error } = await supabase.from('players').update(data as never).eq('id', id)
      if (error) throw error
    }, undefined)
  },

  async deletePlayer(id: string) {
    const local = getLocal(); const players = local.players || []
    saveLocal({ ...local, players: players.filter((p: any) => p.id !== id) })
    return tryCatch(async () => {
      await supabase.from('players').delete().eq('id', id)
    }, undefined)
  },

  async deleteMatchEvent(id: string) {
    const local = getLocal()
    saveLocal({ ...local, matchEvents: local.matchEvents.filter((e: any) => e.id !== id) })
    return tryCatch(async () => {
      await supabase.from('match_events').delete().eq('id', id)
    }, undefined)
  },

  async bulkCreateMatches(matches: Record<string, unknown>[]) {
    const results = []
    for (const m of matches) {
      results.push(await api.createMatch(m))
    }
    return results
  },

  async generateRoundRobin(tournamentId: string, teamIds: string[]) {
    const matches = []
    for (let i = 0; i < teamIds.length; i++) {
      for (let j = i + 1; j < teamIds.length; j++) {
        matches.push({
          tournament_id: tournamentId,
          team_a: teamIds[i],
          team_b: teamIds[j],
          status: 'pending',
          score_a: 0,
          score_b: 0,
          field_name: null,
          starts_at: null
        })
      }
    }
    return api.bulkCreateMatches(matches)
  },

  subscribeToMatches(tournamentId: string, callback: () => void) {
    return supabase
      .channel(`matches-${tournamentId}`)
      .on('postgres_changes' as never, {
        event: '*', schema: 'public', table: 'matches',
        filter: `tournament_id=eq.${tournamentId}`
      } as never, callback)
      .subscribe()
  },

  subscribeToMatchEvents(matchId: string, callback: () => void) {
    return supabase
      .channel(`events-${matchId}`)
      .on('postgres_changes' as never, {
        event: '*', schema: 'public', table: 'match_events',
        filter: `match_id=eq.${matchId}`
      } as never, callback)
      .subscribe()
  }
}
