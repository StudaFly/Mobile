import { colors } from '@/design-system/tokens';
import type { TaskCategory } from './types/task.types';

export interface CategoryMeta {
  iconName: string;
  color: string;
  bg: string;
}

export const CATEGORY_META: Record<TaskCategory, CategoryMeta> = {
  admin: { iconName: 'FileText', color: colors.blue, bg: '#EEF2FF' },
  finance: { iconName: 'CreditCard', color: colors.gold, bg: '#FFFBEB' },
  health: { iconName: 'Heart', color: colors.danger, bg: '#FEF2F2' },
  housing: { iconName: 'Home', color: colors.success, bg: '#F0FDF4' },
  practical: { iconName: 'Smartphone', color: colors.warning, bg: '#FFFBEB' },
};
