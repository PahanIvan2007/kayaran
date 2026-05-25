import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Swords, Shield, Zap, Crown, Skull, Ghost, Flame, Heart, Crosshair } from 'lucide-react'

interface Card {
  id: string
  name: string
  power: number
  faction: 'north' | 'nilfgaard'
  icon: string
  desc: string
}

const FACTION_ICONS: Record<string, typeof Swords> = {
  north: Crown, nilfgaard: Skull,
  infantry: Swords, cavalry: Shield, mage: Zap, berserker: Flame,
  spy: Ghost, sniper: Crosshair
}

function createDeck(faction: 'north' | 'nilfgaard'): Card[] {
  const names = faction === 'north'
    ? [
      { name: 'Танкред Тиссен', power: 10, icon: 'cavalry', desc: 'Тяжёлая кавалерия' },
      { name: 'Филиппа Эйльхарт', power: 8, icon: 'mage', desc: 'Чародейка' },
      { name: 'Вернон Роше', power: 7, icon: 'infantry', desc: 'Командир' },
      { name: 'Джон Наталис', power: 6, icon: 'infantry', desc: 'Маршал' },
      { name: 'Силезская Армия', power: 5, icon: 'infantry', desc: 'Пехота' },
      { name: 'Краснолюдский Полк', power: 5, icon: 'infantry', desc: 'Элита' },
      { name: 'Лучники', power: 4, icon: 'sniper', desc: 'Дальний бой' },
      { name: 'Кавалеристы', power: 4, icon: 'cavalry', desc: 'Лёгкая кавалерия' },
      { name: 'Копейщики', power: 3, icon: 'infantry', desc: 'Пикинёры' },
      { name: 'Разведчики', power: 2, icon: 'spy', desc: 'Разведка' },
    ]
    : [
      { name: 'Эмгыр вар Эмрейс', power: 10, icon: 'cavalry', desc: 'Император' },
      { name: 'Морвран Ворхис', power: 8, icon: 'mage', desc: 'Чернокнижник' },
      { name: 'Кахир Маур Дыффин', power: 7, icon: 'cavalry', desc: 'Рыцарь' },
      { name: 'Альба Дивизия', power: 6, icon: 'infantry', desc: 'Элитная гвардия' },
      { name: 'Наузикайцы', power: 5, icon: 'infantry', desc: 'Штурмовики' },
      { name: 'Ведьмак-Убийца', power: 5, icon: 'berserker', desc: 'Охотник' },
      { name: 'Арбалетчики', power: 4, icon: 'sniper', desc: 'Дальний бой' },
      { name: 'Тяжёлая Пехота', power: 4, icon: 'infantry', desc: 'Щитоносцы' },
      { name: 'Шпионы', power: 3, icon: 'spy', desc: 'Тайная сеть' },
      { name: 'Ассасины', power: 2, icon: 'ghost', desc: 'Скрытный удар' },
    ]
  return names.map((n, i) => ({
    id: `${faction}-${i}`, ...n, faction
  }))
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getIcon(iconName: string) {
  const Icon = FACTION_ICONS[iconName] || Swords
  return <Icon className="w-4 h-4" />
}

type GamePhase = 'menu' | 'mulligan' | 'play' | 'round_end' | 'game_end'

export default function GwentGame() {
  const [phase, setPhase] = useState<GamePhase>('menu')
  const [playerDeck, setPlayerDeck] = useState<Card[]>([])
  const [aiDeck, setAiDeck] = useState<Card[]>([])
  const [playerHand, setPlayerHand] = useState<Card[]>([])
  const [aiHand, setAiHand] = useState<Card[]>([])
  const [playerBoard, setPlayerBoard] = useState<Card[]>([])
  const [aiBoard, setAiBoard] = useState<Card[]>([])
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [playerWins, setPlayerWins] = useState(0)
  const [aiWins, setAiWins] = useState(0)
  const [round, setRound] = useState(1)
  const [turn, setTurn] = useState<'player' | 'ai'>('player')
  const [passed, setPassed] = useState({ player: false, ai: false })
  const [, setGameOver] = useState(false)
  const [log, setLog] = useState<string[]>([])
  const [mulliganCount, setMulliganCount] = useState(2)

  const startGame = useCallback(() => {
    const pDeck = shuffle(createDeck('north'))
    const aDeck = shuffle(createDeck('nilfgaard'))
    setPlayerDeck(pDeck.slice(8))
    setAiDeck(aDeck.slice(8))
    setPlayerHand(shuffle(pDeck.slice(0, 8)))
    setAiHand(shuffle(aDeck.slice(0, 8)))
    setPlayerBoard([])
    setAiBoard([])
    setPlayerScore(0)
    setAiScore(0)
    setPlayerWins(0)
    setAiWins(0)
    setRound(1)
    setTurn('player')
    setPassed({ player: false, ai: false })
    setLog([])
    setGameOver(false)
    setPhase('mulligan')
    setMulliganCount(2)
  }, [])

  const mulligan = (cardId: string) => {
    if (mulliganCount <= 0) return
    setPlayerHand(h => {
      const card = h.find(c => c.id === cardId)
      if (!card) return h
      const newHand = h.filter(c => c.id !== cardId)
      const [drawn, ...restDeck] = playerDeck
      if (drawn) {
        setPlayerDeck(restDeck)
        return [...newHand, drawn]
      }
      return newHand
    })
    setMulliganCount(c => c - 1)
  }

  const finishMulligan = () => setPhase('play')

  const playCard = (cardId: string) => {
    if (phase !== 'play' || turn !== 'player' || passed.player) return
    const card = playerHand.find(c => c.id === cardId)
    if (!card) return
    setPlayerHand(h => h.filter(c => c.id !== cardId))
    setPlayerBoard(b => [...b, card])
    setLog(l => [`Вы сыграли ${card.name} (${card.power})`, ...l].slice(0, 8))
    setTurn('ai')
  }

  const pass = () => {
    if (phase !== 'play' || turn !== 'player' || passed.player) return
    setPassed(p => ({ ...p, player: true }))
    setLog(l => [`Вы пасуете`, ...l].slice(0, 8))
    setTurn('ai')
  }

  useEffect(() => {
    if (phase !== 'play' || turn !== 'ai' || passed.ai) return
    const timer = setTimeout(() => {
      const canPlay = aiHand.filter(c => c.power > 0)
      if (canPlay.length === 0 || passed.player) {
        setPassed(p => ({ ...p, ai: true }))
        setLog(l => [`Противник пасует`, ...l].slice(0, 8))
        setTurn('player')
        return
      }

      const playPower = canPlay.reduce((s, c) => s + c.power, 0)
      const aiTotal = aiBoard.reduce((s, c) => s + c.power, 0)
      const playerTotal = playerBoard.reduce((s, c) => s + c.power, 0)

      if (playerTotal > aiTotal + playPower && passed.player) {
        setPassed(p => ({ ...p, ai: true }))
        setLog(l => [`Противник пасует`, ...l].slice(0, 8))
        setTurn('player')
        return
      }

      const card = canPlay[Math.floor(Math.random() * canPlay.length)]
      setAiHand(h => h.filter(c => c.id !== card.id))
      setAiBoard(b => [...b, card])
      setLog(l => [`Противник сыграл ${card.name} (${card.power})`, ...l].slice(0, 8))
      setTurn('player')
    }, 800 + Math.random() * 400)
    return () => clearTimeout(timer)
  }, [turn, phase, aiHand, aiBoard, playerBoard, passed])

  useEffect(() => {
    if (!passed.player || !passed.ai) return

    const pScore = playerBoard.reduce((s, c) => s + c.power, 0)
    const aScore = aiBoard.reduce((s, c) => s + c.power, 0)
    setPlayerScore(pScore)
    setAiScore(aScore)

    const timer = setTimeout(() => {
      if (pScore > aScore) {
        setPlayerWins(w => w + 1)
        setLog(l => [`Раунд ${round}: победа! ${pScore} vs ${aScore}`, ...l])
      } else if (aScore > pScore) {
        setAiWins(w => w + 1)
        setLog(l => [`Раунд ${round}: поражение ${pScore} vs ${aScore}`, ...l])
      } else {
        setLog(l => [`Раунд ${round}: ничья ${pScore} vs ${aScore}`, ...l])
      }

      if (playerWins >= 2 || aiWins >= 2 || round >= 3) {
        setPhase('game_end')
        setGameOver(true)
      } else {
        setPhase('round_end')
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [passed])

  const nextRound = () => {
    setPlayerBoard([])
    setAiBoard([])
    setPlayerScore(0)
    setAiScore(0)
    setPassed({ player: false, ai: false })
    setTurn('player')
    setRound(r => r + 1)

    const [pCard, ...pRest] = playerDeck
    const [aCard, ...aRest] = aiDeck
    if (pCard) { setPlayerHand(h => [...h, pCard]); setPlayerDeck(pRest) }
    if (aCard) { setAiHand(h => [...h, aCard]); setAiDeck(aRest) }
    setPhase('play')
  }

  return (
    <div className="glass-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-[#a78bfa]" />
          <span className="text-sm text-[#64748b] tracking-[0.15em] uppercase">Гвинт</span>
        </div>
        {(phase === 'play' || phase === 'round_end') && (
          <div className="flex items-center gap-2 text-[11px]">
            <span className={`px-2 py-0.5 rounded ${playerWins > aiWins ? 'bg-emerald-500/20 text-emerald-400' : 'text-[#64748b]'}`}>Вы: {playerWins}</span>
            <span className="text-[#475569]">Раунд {round}/3</span>
            <span className={`px-2 py-0.5 rounded ${aiWins > playerWins ? 'bg-red-500/20 text-red-400' : 'text-[#64748b]'}`}>AI: {aiWins}</span>
          </div>
        )}
      </div>

      {phase === 'menu' && (
        <div className="py-8 text-center">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
            <Swords className="w-14 h-14 text-white" />
          </div>
          <p className="text-xl font-bold text-gradient mb-2">Гвинт</p>
          <p className="text-xs text-[#64748b] mb-1">Карточная игра из мира Ведьмака</p>
          <p className="text-xs text-[#475569] mb-6">3 раунда · Кто наберёт 2 победы</p>
          <button onClick={startGame} className="btn-primary text-base px-10 py-4">
            <Swords className="w-5 h-5" />НАЧАТЬ ИГРУ
          </button>
        </div>
      )}

      {(phase === 'mulligan' || phase === 'play' || phase === 'round_end' || phase === 'game_end') && (
        <div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-[#64748b]">Противник (Nilfgaard)</span>
              <span className="text-sm font-bold text-[#a78bfa] tabular-nums">{aiBoard.reduce((s, c) => s + c.power, 0)}</span>
            </div>
            <div className="bg-[#1a1a25] rounded-xl p-2 min-h-[60px] border border-[#2a2a3a]">
              <div className="flex gap-1.5 flex-wrap">
                {aiBoard.map(c => (
                  <div key={c.id} className="bg-red-900/20 border border-red-900/30 rounded-lg px-2 py-1 text-[11px] text-red-300 flex items-center gap-1">
                    {getIcon(c.icon)}{c.power}
                  </div>
                ))}
              </div>
              {aiBoard.length === 0 && <p className="text-[10px] text-[#475569] text-center py-2">Поле противника</p>}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-[#64748b]">Ваше поле (Northern Realms)</span>
              <span className="text-sm font-bold text-[#a78bfa] tabular-nums">{playerBoard.reduce((s, c) => s + c.power, 0)}</span>
            </div>
            <div className="bg-[#1a1a25] rounded-xl p-2 min-h-[60px] border border-[#2a2a3a]">
              <div className="flex gap-1.5 flex-wrap">
                {playerBoard.map(c => (
                  <div key={c.id} className="bg-emerald-900/20 border border-emerald-900/30 rounded-lg px-2 py-1 text-[11px] text-emerald-300 flex items-center gap-1">
                    {getIcon(c.icon)}{c.power}
                  </div>
                ))}
              </div>
              {playerBoard.length === 0 && <p className="text-[10px] text-[#475569] text-center py-2">Ваше поле</p>}
            </div>
          </div>

          {phase === 'mulligan' && (
            <div className="text-center py-4">
              <p className="text-sm text-[#64748b] mb-3">Замените карты ({mulliganCount} осталось)</p>
              <div className="flex gap-2 flex-wrap justify-center mb-4">
                {playerHand.map(c => (
                  <button key={c.id} onClick={() => mulligan(c.id)}
                    className="bg-[#2a2a3a] hover:bg-[#3a3a4a] border border-[#3a3a4a] rounded-lg px-3 py-2 text-sm transition-all text-left"
                  >
                    <p className="font-medium text-[#cbd5e1]">{c.name}</p>
                    <p className="text-[10px] text-[#475569]">{c.power} ед. · {c.desc}</p>
                  </button>
                ))}
              </div>
              <button onClick={finishMulligan} className="btn-primary">
                <Swords className="w-4 h-4" />Начать раунд
              </button>
            </div>
          )}

          {(phase === 'play' || phase === 'round_end') && (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#64748b]">Рука ({playerHand.length} карт)</span>
                  <div className="flex gap-2">
                    {turn === 'player' && !passed.player && (
                      <button onClick={pass} className="btn-ghost text-xs text-amber-400">
                        <Heart className="w-3 h-3" />Пас
                      </button>
                    )}
                  </div>
                </div>
                {phase === 'play' ? (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {playerHand.map(c => (
                      <motion.button key={c.id} whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }}
                        onClick={() => playCard(c.id)}
                        disabled={turn !== 'player' || passed.player}
                        className="flex-shrink-0 bg-[#1a1a25] hover:bg-[#2a2a3a] border border-[#2a2a3a] hover:border-[#8b5cf6]/50 rounded-xl p-3 text-left transition-all min-w-[120px] disabled:opacity-40"
                      >
                        <p className="text-sm font-medium text-[#cbd5e1] truncate">{c.name}</p>
                        <p className="text-lg font-black text-[#a78bfa] tabular-nums">{c.power}</p>
                        <p className="text-[10px] text-[#475569]">{c.desc}</p>
                      </motion.button>
                    ))}
                    {playerHand.length === 0 && <p className="text-xs text-[#475569] py-4">Нет карт</p>}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-[#cbd5e1] mb-1">
                      {playerScore > aiScore ? '🎉 Вы выиграли раунд!' : aiScore > playerScore ? '😔 Противник выиграл раунд' : '🤝 Ничья'}
                    </p>
                    <p className="text-xs text-[#64748b] mb-4">{playerScore} vs {aiScore}</p>
                    <button onClick={nextRound} className="btn-primary">
                      <Swords className="w-4 h-4" />Следующий раунд
                    </button>
                  </div>
                )}
              </div>

              {turn === 'ai' && !passed.ai && (
                <p className="text-xs text-[#f59e0b] text-center mt-2 animate-pulse">Противник ходит...</p>
              )}
            </>
          )}

          {phase === 'game_end' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: playerWins > aiWins ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', border: `1px solid ${playerWins > aiWins ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}
              >
                {playerWins > aiWins ? <Crown className="w-10 h-10 text-emerald-400" /> : <Skull className="w-10 h-10 text-red-400" />}
              </div>
              <p className="text-xl font-bold text-gradient mb-2">
                {playerWins > aiWins ? 'ПОБЕДА!' : 'ПОРАЖЕНИЕ'}
              </p>
              <p className="text-xs text-[#64748b] mb-1">{playerWins} - {aiWins}</p>
              <button onClick={startGame} className="btn-primary mt-4">
                <Swords className="w-4 h-4" />Играть снова
              </button>
            </div>
          )}
        </div>
      )}

      {log.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#2a2a3a]/50">
          <p className="text-[10px] text-[#475569] mb-1 tracking-wider uppercase">Лог</p>
          <div className="space-y-0.5 max-h-16 overflow-y-auto">
            {log.map((entry, i) => (
              <p key={i} className="text-[10px] text-[#475569]">{entry}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
