export function formatCronReadable(cron: string): string {
  const presets: Record<string, string> = {
    '0 8 * * 1-5': 'Mo-Fr 8:00 AM',
    '0 18 * * *': 'Daily 6:00 PM',
    '0 9 * * *': 'Daily 9:00 AM',
    '0 12 * * *': 'Daily 12:00 PM',
    '0 0 * * *': 'Daily Midnight',
    '0 */6 * * *': 'Every 6 hours'
  }
  
  return presets[cron] || cron
}

export function calculateNextRun(cron: string): string {
  // Simplified - in production use a cron parser library
  const now = new Date()
  const [minute, hour] = cron.split(' ').map(Number)
  
  const next = new Date(now)
  next.setHours(hour, minute, 0, 0)
  
  if (next <= now) {
    next.setDate(next.getDate() + 1)
  }
  
  const diff = next.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 24) {
    return `In ${hours} hours`
  } else {
    return next.toLocaleDateString('de-DE', { 
      weekday: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
}

export const CRON_PRESETS = [
  { label: 'Every Morning (8 AM)', value: '0 8 * * *' },
  { label: 'Workdays Morning (8 AM)', value: '0 8 * * 1-5' },
  { label: 'Every Evening (6 PM)', value: '0 18 * * *' },
  { label: 'Twice Daily', value: '0 8,18 * * *' },
  { label: 'Every 6 hours', value: '0 */6 * * *' },
  { label: 'Daily Midnight', value: '0 0 * * *' },
]
