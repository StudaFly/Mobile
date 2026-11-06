/** "à l'instant", "il y a 5 min", "il y a 3 h", "hier", "il y a 4 j", then "12 oct." */
export function formatRelativeTime(isoDate: string, now: Date = new Date()): string {
  const date = new Date(isoDate);
  const minutes = Math.floor((now.getTime() - date.getTime()) / 60_000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'hier';
  if (days < 7) return `il y a ${days} j`;
  const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

/** Badge text: the count, capped at "9+". */
export function formatBadge(count: number): string {
  return count > 9 ? '9+' : String(count);
}

const TASK_TYPES = new Set(['task_due_soon', 'task_due_today', 'task_overdue']);

export function isTaskReminder(type: string): boolean {
  return TASK_TYPES.has(type);
}
