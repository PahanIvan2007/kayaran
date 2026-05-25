import QRCode from 'react-qr-code'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'

interface Props { value: string; title?: string }

export default function QRCard({ value, title }: Props) {
  const handleDownload = () => {
    const svg = document.getElementById('qr-code')
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width * 2; canvas.height = img.height * 2
      ctx?.scale(2, 2); ctx?.drawImage(img, 0, 0)
      const link = document.createElement('a')
      link.download = 'kayaran-qr.png'; link.href = canvas.toDataURL('image/png'); link.click()
    }
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card-glow p-6 text-center">
      {title && <p className="text-xs text-[#64748b] tracking-[0.15em] uppercase mb-6">{title}</p>}
      <div className="bg-white p-4 rounded-2xl inline-block shadow-inner">
        <div id="qr-code"><QRCode value={value} size={180} /></div>
      </div>
      <p className="mt-4 text-[11px] text-[#475569] break-all max-w-xs mx-auto">{value}</p>
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleDownload} className="btn-primary mt-6">
        <Download className="w-4 h-4" />Скачать QR
      </motion.button>
    </motion.div>
  )
}
