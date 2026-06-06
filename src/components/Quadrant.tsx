
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
          "flex flex-col rounded-xl border-2 transition-colors overflow-hidden h-full min-h-[150px] md:min-h-0",
          config.colorClass,
          isOver && "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-950",
          "bg-opacity-50 dark:bg-opacity-20 backdrop-blur-sm"
        )
      )}
    >
      <div 
        className="p-3 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        onClick={() => toggleQuadrantCollapse(id)}
        aria-expanded={!isCollapsed}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
          <div className="p-1.5 sm:p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm shrink-0">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm sm:text-base truncate">{config.title}</h2>
            <p className="text-xs opacity-80 truncate hidden sm:block">{config.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="text-xs sm:text-sm font-medium bg-white/50 dark:bg-slate-800/50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
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
          <div className="h-full min-h-[120px] flex flex-col items-center justify-center text-center opacity-60 border-2 border-dashed border-current rounded-lg p-4 m-2">
            <p className="text-sm font-medium mb-2">No tasks here</p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                addTask('New Task', id);
              }}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-3 h-3" /> Add Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
