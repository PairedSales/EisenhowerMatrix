import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import type { Task, QuadrantId } from '../types';

interface UIState {
  searchQuery: string;
  showCompleted: boolean;
  collapsedQuadrants: QuadrantId[];
  _hasHydrated: boolean;
}

export interface StoreState {
  tasks: Record<string, Task>;
  ui: UIState;
}

interface StoreActions {
  addTask: (title: string, quadrantId: QuadrantId) => void;
  editTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, toQuadrantId: QuadrantId, newOrder: number) => void;
  reorderTask: (id: string, newOrder: number) => void;
  toggleCompletion: (id: string) => void;
  clearCompleted: () => void;
  setSearchQuery: (query: string) => void;
  setShowCompleted: (show: boolean) => void;
  toggleQuadrantCollapse: (quadrantId: QuadrantId) => void;
  importState: (newState: StoreState) => void;
  setHasHydrated: (state: boolean) => void;
}

type Store = StoreState & { actions: StoreActions };

const initialUIState: UIState = {
  searchQuery: '',
  showCompleted: true,
  collapsedQuadrants: [],
  _hasHydrated: false,
};

export const useStore = create<Store>()(
  temporal(
    persist(
    (set, get) => ({
      tasks: {},
      ui: initialUIState,
      actions: {
        addTask: (title, quadrantId) => {
          const id = uuidv4();
          const now = new Date().toISOString();
          const quadrantTasks = Object.values(get().tasks).filter(t => t.quadrantId === quadrantId);
          const maxOrder = quadrantTasks.length > 0 ? Math.max(...quadrantTasks.map(t => t.order)) : -1;
          
          set((state) => ({
            tasks: {
              ...state.tasks,
              [id]: {
                id,
                title,
                quadrantId,
                completed: false,
                createdAt: now,
                updatedAt: now,
                order: maxOrder + 1,
              },
            },
          }));
        },
        editTask: (id, updates) => {
          set((state) => {
            const task = state.tasks[id];
            if (!task) return state;
            return {
              tasks: {
                ...state.tasks,
                [id]: {
                  ...task,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                },
              },
            };
          });
        },
        deleteTask: (id) => {
          set((state) => {
            const newTasks = { ...state.tasks };
            delete newTasks[id];
            return { tasks: newTasks };
          });
          toast('Task deleted', {
            action: {
              label: 'Undo',
              onClick: () => useStore.temporal.getState().undo()
            }
          });
        },
        moveTask: (id, toQuadrantId, newOrder) => {
          set((state) => {
            const task = state.tasks[id];
            if (!task) return state;
            
            const newTasks = { ...state.tasks };
            
            newTasks[id] = {
              ...task,
              quadrantId: toQuadrantId,
              order: newOrder,
              updatedAt: new Date().toISOString(),
            };
            
            const targetTasks = Object.values(newTasks)
              .filter(t => t.quadrantId === toQuadrantId)
              .sort((a, b) => {
                if (a.id === id) return newOrder - b.order - 0.5;
                if (b.id === id) return a.order - newOrder + 0.5;
                return a.order - b.order;
              });
              
            targetTasks.forEach((t, i) => {
              newTasks[t.id] = { ...newTasks[t.id], order: i };
            });
            
            return { tasks: newTasks };
          });
        },
        reorderTask: (id, newOrder) => {
          set((state) => {
            const task = state.tasks[id];
            if (!task) return state;
            
            const newTasks = { ...state.tasks };
            newTasks[id] = { ...task, order: newOrder, updatedAt: new Date().toISOString() };
            
            const targetTasks = Object.values(newTasks)
              .filter(t => t.quadrantId === task.quadrantId)
              .sort((a, b) => {
                if (a.id === id) return newOrder - b.order - 0.5;
                if (b.id === id) return a.order - newOrder + 0.5;
                return a.order - b.order;
              });
              
            targetTasks.forEach((t, i) => {
              newTasks[t.id] = { ...newTasks[t.id], order: i };
            });
            
            return { tasks: newTasks };
          });
        },
        toggleCompletion: (id) => {
          set((state) => {
            const task = state.tasks[id];
            if (!task) return state;
            return {
              tasks: {
                ...state.tasks,
                [id]: { ...task, completed: !task.completed, updatedAt: new Date().toISOString() },
              },
            };
          });
        },
        clearCompleted: () => {
          set((state) => {
            const newTasks = { ...state.tasks };
            for (const id in newTasks) {
              if (newTasks[id].completed) {
                delete newTasks[id];
              }
            }
            return { tasks: newTasks };
          });
          toast('Completed tasks cleared', {
            action: {
              label: 'Undo',
              onClick: () => useStore.temporal.getState().undo()
            }
          });
        },
        setSearchQuery: (query) => set((state) => ({ ui: { ...state.ui, searchQuery: query } })),
        setShowCompleted: (show) => set((state) => ({ ui: { ...state.ui, showCompleted: show } })),
        toggleQuadrantCollapse: (quadrantId) => set((state) => {
          const collapsed = state.ui.collapsedQuadrants;
          const newCollapsed = collapsed.includes(quadrantId)
            ? collapsed.filter(id => id !== quadrantId)
            : [...collapsed, quadrantId];
          return { ui: { ...state.ui, collapsedQuadrants: newCollapsed } };
        }),
        importState: (newState) => set(() => ({
          tasks: newState.tasks,
          ui: { ...newState.ui, _hasHydrated: true }
        })),
        setHasHydrated: (hydrated) => set((state) => ({ ui: { ...state.ui, _hasHydrated: hydrated } })),
      },
    }),
    {
      name: 'eisenhower-matrix-v1',
      version: 1,
      partialize: (state) => ({
        tasks: state.tasks,
        ui: { ...state.ui, _hasHydrated: false },
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.actions.setHasHydrated(true);
        }
      },
    }
  ), {
    partialize: (state) => ({ tasks: state.tasks }),
  })
);

export const useTasks = () => useStore(state => state.tasks);
export const useUI = () => useStore(state => state.ui);
export const useActions = () => useStore(state => state.actions);
