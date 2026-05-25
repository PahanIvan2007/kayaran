import { useState } from 'react'
import { motion } from 'framer-motion'
import TapChampion from '../components/games/TapChampion'
import PenaltyShootout from '../components/games/PenaltyShootout'
import ScorePredictor from '../components/games/ScorePredictor'
import GwentGame from '../components/games/GwentGame'
import DicePoker from '../components/games/DicePoker'
import ArmWrestling from '../components/games/ArmWrestling'
import Blackjack from '../components/games/Blackjack'
import { Zap, Target, Brain, Swords, Dice6, Heart, Sparkles, Gamepad2 } from 'lucide-react'

const games = [
  { id: 'gwent', label: 'Гвинт', icon: Swords, desc: 'Карточная битва из Ведьмака', color: '#8b5cf6', comp: GwentGame },
  { id: 'dice', label: 'Dice Poker', icon: Dice6, desc: 'Покер на костях', color: '#06b6d4', comp: DicePoker },
  { id: 'arm', label: 'Армрестлинг', icon: Heart, desc: 'Кто сильнее? Дави на пробел!', color: '#ef4444', comp: ArmWrestling },
  { id: 'blackjack', label: 'Blackjack', icon: Sparkles, desc: '21 — обыграй дилера', color: '#10b981', comp: Blackjack },
  { id: 'tap', label: 'Tap Champion', icon: Zap, desc: 'Тапай как бешеный! 15 секунд', color: '#f59e0b', comp: TapChampion },
  { id: 'penalty', label: 'Penalty Shootout', icon: Target, desc: 'Попади в створ ворот', color: '#ec4899', comp: PenaltyShootout },
  { id: 'predict', label: 'Score Predictor', icon: Brain, desc: 'Угадай счёт матчей', color: '#6366f1', comp: ScorePredictor },
]

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<string | null>(null)

  const ActiveComp = games.find(g => g.id === activeGame)?.comp

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[#64748b] text-xs tracking-[0.2em] uppercase mb-1">Games</p>
        <h1 className="heading-lg"><span className="text-gradient">Мини-игры</span></h1>
        <p className="text-xs text-[#475569] mt-1">7 игр — от Гвинта до Блэкджека</p>
      </div>

      {!activeGame ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {games.map((game, i) => (
            <motion.button key={game.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4 }}
              onClick={() => setActiveGame(game.id)}
              className="card-hover p-5 text-left"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${game.color}20`, border: `1px solid ${game.color}40` }}>
                <game.icon className="w-6 h-6" style={{ color: game.color }} />
              </div>
              <h3 className="font-semibold text-sm text-[#cbd5e1] mb-1">{game.label}</h3>
              <p className="text-xs text-[#475569]">{game.desc}</p>
            </motion.button>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={() => setActiveGame(null)} className="btn-ghost mb-4 text-xs">
            <Gamepad2 className="w-3.5 h-3.5" />Все игры
          </button>
          <motion.div key={activeGame} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {ActiveComp && <ActiveComp />}
          </motion.div>
        </div>
      )}
    </div>
  )
}
