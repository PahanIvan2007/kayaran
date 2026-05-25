import { create } from 'zustand'

interface MatchItem {
  id: string
  tournament_id: string
  team_a: string
  team_b: string
  score_a: number
  score_b: number
  field_name: string | null
  starts_at: string | null
  status: string
  created_at: string
}

interface TournamentItem {
  id: string
  title: string
  location: string | null
  start_date: string | null
  end_date: string | null
  status: string
  created_by: string | null
  created_at: string
}

interface TeamItem {
  id: string
  name: string
  logo: string | null
  created_by: string | null
  created_at: string
}

interface TournamentState {
  tournament: TournamentItem | null
  tournaments: TournamentItem[]
  matches: MatchItem[]
  teams: TeamItem[]
  loading: boolean
  error: string | null

  setTournament: (tournament: TournamentItem | null) => void
  setTournaments: (tournaments: TournamentItem[]) => void
  setMatches: (matches: MatchItem[]) => void
  setTeams: (teams: TeamItem[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  updateMatchScore: (matchId: string, scoreA: number, scoreB: number) => void
  updateMatchStatus: (matchId: string, status: string) => void
  reset: () => void
}

const initialState = {
  tournament: null,
  tournaments: [],
  matches: [],
  teams: [],
  loading: false,
  error: null
}

export const useTournamentStore = create<TournamentState>((set) => ({
  ...initialState,

  setTournament: (tournament) => set({ tournament }),
  setTournaments: (tournaments) => set({ tournaments }),
  setMatches: (matches) => set({ matches }),
  setTeams: (teams) => set({ teams }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  updateMatchScore: (matchId, scoreA, scoreB) =>
    set((state) => ({
      matches: state.matches.map((m: MatchItem) =>
        m.id === matchId ? { ...m, score_a: scoreA, score_b: scoreB } : m
      )
    })),

  updateMatchStatus: (matchId, status) =>
    set((state) => ({
      matches: state.matches.map((m: MatchItem) =>
        m.id === matchId ? { ...m, status } : m
      )
    })),

  reset: () => set(initialState)
}))
