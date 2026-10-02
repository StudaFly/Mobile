export function formatLongDate(isoDate: string): string {
  const [y, m, d] = isoDate.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDestination(destination: { city: string; country: string }): string {
  return `${destination.city}, ${destination.country}`;
}
