import { useMemo } from 'react';
import { useStore } from './useStore';
import type { QuadrantId } from '../types';

export const useFilteredAndSortedTasks = (quadrantId: QuadrantId) => {
  const tasks = useStore(state => state.tasks);
  const searchQuery = useStore(state => state.ui.searchQuery);
  return useMemo(() => {
    return Object.values(tasks)
      .filter((task) => task.quadrantId === quadrantId)
      .filter((task) => {
        if (task.completed) return false;
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          return (
            task.title.toLowerCase().includes(lowerQuery) ||
            (task.notes && task.notes.toLowerCase().includes(lowerQuery))
          );
        }
        return true;
      })
      .sort((a, b) => a.order - b.order);
  }, [tasks, searchQuery, quadrantId]);
};

export const useAllFilteredTasks = () => {
  const tasks = useStore(state => state.tasks);
  const searchQuery = useStore(state => state.ui.searchQuery);
  return useMemo(() => {
    return Object.values(tasks).filter((task) => {
      if (task.completed) return false;
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(lowerQuery) ||
          (task.notes && task.notes.toLowerCase().includes(lowerQuery))
        );
      }
      return true;
    });
  }, [tasks, searchQuery]);
};

export const useCompletedTasks = () => {
  const tasks = useStore(state => state.tasks);
  
  return useMemo(() => {
    return Object.values(tasks)
      .filter(task => task.completed)
      .sort((a, b) => {
        const timeA = a.completedAt ? new Date(a.completedAt).getTime() : new Date(a.updatedAt).getTime();
        const timeB = b.completedAt ? new Date(b.completedAt).getTime() : new Date(b.updatedAt).getTime();
        return timeB - timeA;
      });
  }, [tasks]);
};
