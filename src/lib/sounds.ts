// Feature 11: Sound effects
const audioCtx = typeof AudioContext !== 'undefined' ? new (AudioContext || (window as any).webkitAudioContext)() : null

export function playGoalSound() {
  if (!audioCtx) return
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(880, audioCtx.currentTime)
  osc.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.1)
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3)
  osc.start(audioCtx.currentTime)
  osc.stop(audioCtx.currentTime + 0.3)
}

export function playNotificationSound() {
  if (!audioCtx) return
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(660, audioCtx.currentTime)
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15)
  osc.start(audioCtx.currentTime)
  osc.stop(audioCtx.currentTime + 0.15)
}
