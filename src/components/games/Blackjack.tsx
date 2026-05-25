import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, RotateCcw, Heart, Zap, Sparkles } from 'lucide-react'

const SUITS = ['♠', '♥', '♦', '♣']
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

interface Card {
  rank: string
  suit: string
  value: number
  display: string
}

function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      let value = parseInt(rank)
      if (isNaN(value)) value = rank === 'A' ? 11 : 10
      deck.push({ rank, suit, value, display: `${rank}${suit}` })
    }
  }
  return deck.sort(() => Math.random() - 0.5)
}

function calcHand(hand: Card[]): number {
  let total = hand.reduce((s, c) => s + c.value, 0)
  let aces = hand.filter(c => c.rank === 'A').length
  while (total > 21 && aces > 0) { total -= 10; aces-- }
  return total
}

function cardColor(card: Card) {
  return card.suit === '♥' || card.suit === '♦' ? 'text-red-400' : 'text-[#cbd5e1]'
}

type GamePhase = 'menu' | 'bet' | 'play' | 'result' | 'done'

export default function Blackjack() {
  const [phase, setPhase] = useState<GamePhase>('menu')
  const [deck, setDeck] = useState<Card[]>([])
  const [playerHand, setPlayerHand] = useState<Card[]>([])
  const [dealerHand, setDealerHand] = useState<Card[]>([])
  const [playerTotal, setPlayerTotal] = useState(0)
  const [dealerTotal, setDealerTotal] = useState(0)
  const [chips, setChips] = useState(100)
  const [bet, setBet] = useState(10)
  const [result, setResult] = useState<'win' | 'lose' | 'push' | 'blackjack' | null>(null)
  const [showDealer, setShowDealer] = useState(false)

  const startGame = () => {
    setChips(100)
    setBet(10)
    deal()
  }

  const deal = () => {
    const d = createDeck()
    setDeck(d.slice(4))
    setPlayerHand([d[0], d[2]])
    setDealerHand([d[1], d[3]])
    setShowDealer(false)
    setResult(null)
    setPhase('play')

    const pTotal = calcHand([d[0], d[2]])
    const dTotal = calcHand([d[1]])
    setPlayerTotal(pTotal)
    setDealerTotal(dTotal)

    if (pTotal === 21) {
      setResult('blackjack')
      setPhase('result')
      setChips(c => c + bet * 1.5)
    }
  }

  const hit = () => {
    if (phase !== 'play') return
    const [card, ...rest] = deck
    setDeck(rest)
    const newHand = [...playerHand, card]
    setPlayerHand(newHand)
    const total = calcHand(newHand)
    setPlayerTotal(total)

    if (total > 21) {
      setResult('lose')
      setPhase('result')
      setChips(c => c - bet)
    }
  }

  const stand = () => {
    if (phase !== 'play') return
    setShowDealer(true)

    let dCards = [...dealerHand]
    let dDeck = [...deck]
    let dTotal = calcHand(dCards)

    while (dTotal < 17) {
      const [card, ...rest] = dDeck
      dDeck = rest
      dCards = [...dCards, card]
      dTotal = calcHand(dCards)
    }

    setDealerHand(dCards)
    setDealerTotal(dTotal)

    if (dTotal > 21) {
      setResult('win')
      setChips(c => c + bet)
    } else if (dTotal > playerTotal) {
      setResult('lose')
      setChips(c => c - bet)
    } else if (dTotal === playerTotal) {
      setResult('push')
    } else {
      setResult('win')
      setChips(c => c + bet)
    }

    setPhase('result')
    setDeck(dDeck)
  }

  const nextRound = () => {
    if (chips <= 0) { setPhase('done'); return }
    deal()
  }

  return (
    <div className="glass-card p-4 sm:p-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-[#a78bfa]" />
        <span className="text-sm text-[#64748b] tracking-[0.15em] uppercase">Blackjack</span>
      </div>

      {phase === 'menu' && (
        <div className="py-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <p className="text-lg font-bold text-gradient mb-2">Blackjack (21)</p>
          <p className="text-xs text-[#64748b] mb-1">Обыграй дилера — набери 21</p>
          <p className="text-xs text-[#475569] mb-6">Стартовый банк: 100 фишек</p>
          <button onClick={startGame} className="btn-primary text-base px-10 py-4">
            <Sparkles className="w-5 h-5" />ИГРАТЬ!
          </button>
        </div>
      )}

      {phase === 'play' && (
        <div>
          <div className="flex justify-center gap-2 mb-3">
            <span className="text-[11px] text-[#a78bfa] font-medium">Фишки: {chips}</span>
            <span className="text-[11px] text-[#475569]">Ставка: {bet}</span>
          </div>

          <div className="mb-4">
            <p className="text-[10px] text-[#64748b] uppercase tracking-wider mb-1">Дилер: {showDealer ? dealerTotal : '?'}</p>
            <div className="flex gap-2 justify-center">
              {dealerHand.map((c, i) => (
                <div key={i} className={`w-14 h-20 rounded-xl flex items-center justify-center text-lg font-bold ${i === 1 && !showDealer ? 'bg-[#8b5cf6]/20 border border-[#8b5cf6]/30' : 'bg-[#1a1a25] border border-[#2a2a3a]'} ${cardColor(c)}`}>
                  {i === 1 && !showDealer ? '?' : c.display}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-[10px] text-[#64748b] uppercase tracking-wider mb-1">Вы: {playerTotal}</p>
            <div className="flex gap-2 justify-center">
              {playerHand.map((c, i) => (
                <div key={i} className={`w-14 h-20 rounded-xl flex items-center justify-center text-lg font-bold bg-[#1a1a25] border border-[#2a2a3a] ${cardColor(c)}`}>
                  {c.display}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button onClick={hit} className="btn-primary"><Zap className="w-4 h-4" />Карту</button>
            <button onClick={stand} className="btn-cyber"><Heart className="w-4 h-4" />Хватит</button>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="py-6">
          <div className="flex gap-4 justify-center mb-4">
            <div className="text-center">
              <p className="text-[10px] text-[#64748b]">Дилер</p>
              <p className="text-lg font-black text-[#a78bfa] tabular-nums">{dealerTotal}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-[#64748b]">Вы</p>
              <p className="text-lg font-black text-[#a78bfa] tabular-nums">{playerTotal}</p>
            </div>
          </div>

          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-4xl mb-2">
            {result === 'blackjack' ? '🃏' : result === 'win' ? '🎉' : result === 'push' ? '🤝' : '💀'}
          </motion.div>
          <p className={`text-sm font-bold mb-2 ${result === 'win' || result === 'blackjack' ? 'text-emerald-400' : result === 'push' ? 'text-amber-400' : 'text-red-400'}`}>
            {result === 'blackjack' ? 'БЛЭКДЖЕК!' : result === 'win' ? 'ПОБЕДА!' : result === 'push' ? 'НИЧЬЯ' : 'ПЕРЕБОР'}
          </p>
          <p className="text-xs text-[#64748b] mb-4">Фишки: {chips}</p>
          <button onClick={chips > 0 ? nextRound : () => setPhase('done')} className="btn-primary">
            {chips > 0 ? <Heart className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
            {chips > 0 ? 'Ещё раунд' : 'Итог'}
          </button>
        </div>
      )}

      {phase === 'done' && (
        <div className="py-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-emerald-500/20 border border-emerald-500/30">
            <Trophy className="w-10 h-10 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-gradient mb-2">{chips > 100 ? 'В ПЛЮСЕ!' : chips > 0 ? 'Неплохо' : 'БАНКРОТ'}</p>
          <p className="text-2xl font-black text-[#a78bfa] tabular-nums mb-1">{chips}</p>
          <p className="text-xs text-[#64748b] mb-4">фишек</p>
          <button onClick={startGame} className="btn-primary">
            <RotateCcw className="w-4 h-4" />Сначала
          </button>
        </div>
      )}
    </div>
  )
}
