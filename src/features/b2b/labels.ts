import type { BadgeVariant } from '@/design-system/components/data-display/Badge/Badge';

export const FOLLOW_UP: Record<string, { label: string; variant: BadgeVariant }> = {
  ok: { label: 'En bonne voie', variant: 'success' },
  warning: { label: 'En retard', variant: 'warning' },
  danger: { label: 'Critique', variant: 'danger' },
};

export const ZONE_LABELS: Record<string, string> = {
  europe: 'Europe',
  africa: 'Afrique',
  north_america: 'Amérique du Nord',
  latin_america: 'Amérique latine',
  asia: 'Asie',
  middle_east: 'Moyen-Orient',
  oceania: 'Océanie',
};

export const CATEGORY_LABELS: Record<string, string> = {
  admin: 'Administratif',
  finance: 'Finances',
  housing: 'Logement',
  health: 'Santé',
  practical: 'Pratique',
};

export const formatShortDate = (value: string) =>
  new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
