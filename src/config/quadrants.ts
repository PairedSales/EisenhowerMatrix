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
    colorClass: 'bg-red-50 border-red-200 text-red-900',
  },
  schedule: {
    id: 'schedule',
    title: 'Schedule',
    description: 'Not Urgent & Important',
    icon: Calendar,
    colorClass: 'bg-blue-50 border-blue-200 text-blue-900',
  },
  delegate: {
    id: 'delegate',
    title: 'Delegate',
    description: 'Urgent & Not Important',
    icon: Users,
    colorClass: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-900',
  },
  eliminate: {
    id: 'eliminate',
    title: 'Eliminate',
    description: 'Not Urgent & Not Important',
    icon: Trash2,
    colorClass: 'bg-slate-50 border-slate-200 text-slate-900',
  },
};
