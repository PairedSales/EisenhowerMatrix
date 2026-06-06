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
    title: 'Do First',
    description: 'Urgent & Important',
    icon: AlertCircle,
    colorClass: 'bg-amber-50/80 border-amber-200/60 text-amber-950',
  },
  schedule: {
    id: 'schedule',
    title: 'Schedule',
    description: 'Not Urgent & Important',
    icon: Calendar,
    colorClass: 'bg-teal-50/80 border-teal-200/60 text-teal-950',
  },
  delegate: {
    id: 'delegate',
    title: 'Delegate',
    description: 'Urgent & Not Important',
    icon: Users,
    colorClass: 'bg-orange-50/80 border-orange-200/60 text-orange-950',
  },
  eliminate: {
    id: 'eliminate',
    title: 'Eliminate',
    description: 'Not Urgent & Not Important',
    icon: Trash2,
    colorClass: 'bg-stone-100/80 border-stone-200/60 text-stone-600',
  },
};
