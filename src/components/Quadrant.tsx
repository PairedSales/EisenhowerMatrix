
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { QUADRANTS } from '../config/quadrants';
import type { QuadrantId } from '../types';
import { useFilteredAndSortedTasks } from '../store/selectors';
import { TaskCard } from './TaskCard';
import { useUI, useActions } from '../store/useStore';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface QuadrantProps {
  id: QuadrantId;
}

export const Quadrant = ({ id }: QuadrantProps) => {
  const config = QUADRANTS[id];
  const Icon = config.icon;
  const tasks = useFilteredAndSortedTasks(id);
  const { collapsedQuadrants } = useUI();
  const { toggleQuadrantCollapse, addTask } = useActions();
  
  const isCollapsed = collapsedQuadrants.includes(id);

  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: 'Quadrant', quadrantId: id },
  });

  return (
    <div 
      className={twMerge(
        clsx(
          "flex flex-col rounded-2xl border backdrop-blur-xl shadow-sm transition-all duration-300 overflow-hidden h-full min-h-[150px] md:min-h-0",
          config.colorClass,
          isOver && "ring-2 ring-stone-400 ring-offset-2 ring-offset-stone-50 scale-[1.01] shadow-md"
        )
      )}
    >
      <div 
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-black/5 transition-colors"
        onClick={() => toggleQuadrantCollapse(id)}
        aria-expanded={!isCollapsed}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
          <div className="p-2 bg-white/80 rounded-xl shadow-sm shrink-0">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-base sm:text-lg tracking-tight truncate">{config.title}</h2>
            <p className="text-xs sm:text-sm opacity-80 truncate hidden sm:block font-medium">{config.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="text-sm font-medium bg-white/60 px-2.5 py-1 rounded-full shadow-sm">
            {tasks.length}
          </span>
          {isCollapsed ? <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className={clsx(
          "flex-1 p-2 sm:p-4 overflow-y-auto transition-all",
          isCollapsed ? "hidden" : "block"
        )}
      >
        <SortableContext 
          items={tasks.map(t => t.id)} 
          strategy={verticalListSortingStrategy}
        >
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && !isCollapsed && (
          <div className="h-full min-h-[120px] flex flex-col items-center justify-center text-center opacity-50 border border-dashed border-current rounded-xl p-6 m-2 transition-all">
            <p className="text-sm font-medium mb-3">A peaceful space. No tasks yet.</p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                addTask('New Task', id);
              }}
              className="flex items-center gap-1.5 text-xs px-4 py-2 bg-white/60 hover:bg-white rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-400 font-medium"
            >
              <Plus className="w-3.5 h-3.5" /> Add Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
