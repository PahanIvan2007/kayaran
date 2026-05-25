import { useState, useEffect } from 'react'
import { Share2, Check } from 'lucide-react'

export default function ShareButton({ url, label = 'Поделиться' }: { url: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    setCanShare(!!navigator.share)
  }, [])

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({ url, title: 'Каяран' })
      } catch {}
      return
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <button onClick={handleShare} className="btn-ghost text-xs">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
      {copied ? 'Скопировано' : label}
    </button>
  )
}
