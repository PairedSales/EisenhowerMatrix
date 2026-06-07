
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ChevronDown, Plus } from 'lucide-react';
import { QUADRANTS } from '../config/quadrants';
import type { QuadrantId } from '../types';
import { useFilteredAndSortedTasks } from '../store/selectors';
import { TaskCard } from './TaskCard';
import { useUI, useActions } from '../store/useStore';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

const quadrantVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

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
    <motion.div 
      variants={quadrantVariants}
      className={twMerge(
        clsx(
          "flex flex-col rounded-2xl border backdrop-blur-xl shadow-sm transition-shadow duration-300 overflow-hidden h-full min-h-[150px] md:min-h-0",
          config.colorClass,
          isOver && "ring-2 ring-stone-400 ring-offset-2 ring-offset-stone-50 scale-[1.01] shadow-md"
        )
      )}
    >
      <motion.div 
        whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
        whileTap={{ scale: 0.995 }}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer transition-colors"
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
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              addTask('New Task', id);
            }}
            className="p-1 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors focus:outline-none"
            aria-label="Add task"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
          <motion.div
            animate={{ rotate: isCollapsed ? -90 : 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
          >
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        ref={setNodeRef}
        initial={false}
        animate={{ 
          height: isCollapsed ? 0 : 'auto', 
          opacity: isCollapsed ? 0 : 1
        }}
        style={{ overflow: isCollapsed ? 'hidden' : 'auto' }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        className="flex-1 overflow-x-hidden"
      >
        <div className="p-2 sm:p-4 min-h-full flex flex-col">
          <SortableContext 
            items={tasks.map(t => t.id)} 
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence initial={false}>
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </SortableContext>

          <AnimatePresence>
            {tasks.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-h-[120px] flex flex-col items-center justify-center text-center opacity-60 border border-dashed border-current rounded-xl p-6 m-2 transition-all"
              >
                <Icon className="w-8 h-8 mb-3 opacity-20" />
                <p className="text-sm font-medium mb-4 max-w-[200px] leading-relaxed">{config.emptyState}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
