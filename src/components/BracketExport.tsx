import { Printer } from 'lucide-react'

export default function BracketExport() {
  const handlePrint = () => window.print()

  return (
    <div className="flex gap-2">
      <button onClick={handlePrint} className="btn-ghost text-xs"><Printer className="w-3 h-3" />Печать</button>
    </div>
  )
}
