export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export function formatScore(score: number) {
  return String(score).padStart(2, '0')
}

export function getMatchStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'live':
      return 'bg-green-100 text-green-800 animate-pulse'
    case 'finished':
      return 'bg-gray-100 text-gray-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getMatchStatusLabel(status: string) {
  switch (status) {
    case 'pending':
      return 'Ожидание'
    case 'live':
      return 'В процессе'
    case 'finished':
      return 'Завершён'
    case 'cancelled':
      return 'Отменён'
    default:
      return status
  }
}
