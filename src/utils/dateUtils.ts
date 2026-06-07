export function formatTimeTaken(startIso: string, endIso: string): string {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  const diffMs = end - start;
  
  if (diffMs < 0) return '0 seconds';

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''}`;
  if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''}`;
  if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''}`;
  return `${diffSec} second${diffSec !== 1 ? 's' : ''}`;
}

export function formatDateString(isoString: string): string {
  return new Date(isoString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
