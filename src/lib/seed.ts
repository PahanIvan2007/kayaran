import { api } from './api'

const SEEDED_KEY = 'kayaran_seeded'

export async function seedDemoData() {
  if (localStorage.getItem(SEEDED_KEY)) return

  const team1 = await api.createTeam({ name: 'Соколы' })
  const team2 = await api.createTeam({ name: 'Медведи' })
  const team3 = await api.createTeam({ name: 'Волки' })
  const team4 = await api.createTeam({ name: 'Львы' })

  const tournament = await api.createTournament({
    title: 'Летний кубок 2026',
    location: 'Спорткомплекс «Каяран»',
    status: 'active',
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 86400000 * 7).toISOString()
  })

  const tId = tournament.id

  await api.createMatch({
    tournament_id: tId,
    team_a: team1.id,
    team_b: team2.id,
    field_name: 'Поле №1',
    status: 'live',
    score_a: 2,
    score_b: 1
  })

  await api.createMatch({
    tournament_id: tId,
    team_a: team3.id,
    team_b: team4.id,
    field_name: 'Поле №2',
    status: 'pending',
    score_a: 0,
    score_b: 0
  })

  await api.createMatch({
    tournament_id: tId,
    team_a: team1.id,
    team_b: team4.id,
    field_name: 'Поле №1',
    status: 'finished',
    score_a: 3,
    score_b: 3
  })

  localStorage.setItem(SEEDED_KEY, 'true')
}
