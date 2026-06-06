import { useMemo } from 'react';
import { useStore } from './useStore';
import type { QuadrantId } from '../types';

export const useFilteredAndSortedTasks = (quadrantId: QuadrantId) => {
  const tasks = useStore(state => state.tasks);
  const searchQuery = useStore(state => state.ui.searchQuery);
  const showCompleted = useStore(state => state.ui.showCompleted);

  return useMemo(() => {
    return Object.values(tasks)
      .filter((task) => task.quadrantId === quadrantId)
      .filter((task) => {
        if (!showCompleted && task.completed) return false;
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
  }, [tasks, searchQuery, showCompleted, quadrantId]);
};

export const useAllFilteredTasks = () => {
  const tasks = useStore(state => state.tasks);
  const searchQuery = useStore(state => state.ui.searchQuery);
  const showCompleted = useStore(state => state.ui.showCompleted);

  return useMemo(() => {
    return Object.values(tasks).filter((task) => {
      if (!showCompleted && task.completed) return false;
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(lowerQuery) ||
          (task.notes && task.notes.toLowerCase().includes(lowerQuery))
        );
      }
      return true;
    });
  }, [tasks, searchQuery, showCompleted]);
};
