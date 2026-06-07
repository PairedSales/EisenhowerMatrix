export type QuadrantId = 'do' | 'schedule' | 'delegate' | 'eliminate';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  dueDate?: string;
  quadrantId: QuadrantId;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  order: number;
}
