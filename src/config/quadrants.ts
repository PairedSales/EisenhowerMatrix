import type { QuadrantId } from '../types';
import { AlertCircle, Calendar, Users, Trash2 } from 'lucide-react';

export interface QuadrantConfig {
  id: QuadrantId;
  title: string;
  description: string;
  icon: any;
  colorClass: string;
}

export const QUADRANTS: Record<QuadrantId, QuadrantConfig> = {
  do: {
    id: 'do',
    title: 'Do',
    description: 'Urgent & Important',
    icon: AlertCircle,
    colorClass: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-900 dark:text-red-100',
  },
  schedule: {
    id: 'schedule',
    title: 'Schedule',
    description: 'Not Urgent & Important',
    icon: Calendar,
    colorClass: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-100',
  },
  delegate: {
    id: 'delegate',
    title: 'Delegate',
    description: 'Urgent & Not Important',
    icon: Users,
    colorClass: 'bg-fuchsia-50 dark:bg-fuchsia-950/30 border-fuchsia-200 dark:border-fuchsia-900 text-fuchsia-900 dark:text-fuchsia-100',
  },
  eliminate: {
    id: 'eliminate',
    title: 'Eliminate',
    description: 'Not Urgent & Not Important',
    icon: Trash2,
    colorClass: 'bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100',
  },
};
