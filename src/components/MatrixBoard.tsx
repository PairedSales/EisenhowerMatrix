import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { QuadrantId } from '../types';
import { Quadrant } from './Quadrant';
import { TaskCard } from './TaskCard';
import { useStore, useActions } from '../store/useStore';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const MatrixBoard = () => {
  const tasks = useStore(state => state.tasks);
  const { moveTask, reorderTask } = useActions();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = tasks[activeId];
    if (!activeTask) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverQuadrant = over.data.current?.type === 'Quadrant';

    if (!isActiveTask) return;

    if (isOverTask) {
      const overTask = tasks[overId];
      if (activeTask.quadrantId !== overTask.quadrantId) {
        const targetTasks = Object.values(tasks)
          .filter(t => t.quadrantId === overTask.quadrantId)
          .sort((a, b) => a.order - b.order);
        
        const overIndex = targetTasks.findIndex(t => t.id === overId);
        
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;
        const newOrder = overIndex >= 0 ? overIndex + modifier : targetTasks.length + 1;
        
        moveTask(activeId, overTask.quadrantId, newOrder);
      }
    }

    if (isOverQuadrant) {
      const overQuadrantId = overId as QuadrantId;
      if (activeTask.quadrantId !== overQuadrantId) {
        // Get max order in target quadrant to append
        const targetTasks = Object.values(tasks)
          .filter(t => t.quadrantId === overQuadrantId);
        const newOrder = targetTasks.length > 0 ? Math.max(...targetTasks.map(t => t.order)) + 1 : 0;
        
        moveTask(activeId, overQuadrantId, newOrder);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = tasks[activeId];
    if (!activeTask) return;

    const isOverTask = over.data.current?.type === 'Task';
    
    if (isOverTask) {
      const overTask = tasks[overId];
      if (activeTask.quadrantId === overTask.quadrantId) {
        const quadrantTasks = Object.values(tasks)
          .filter(t => t.quadrantId === activeTask.quadrantId)
          .sort((a, b) => a.order - b.order);
          
        const newIndex = quadrantTasks.findIndex(t => t.id === overId);
        reorderTask(activeId, newIndex);
      }
    }
  };

  const activeTask = activeId ? tasks[activeId] : null;

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
          transform: 'scale(1.02)',
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 p-2 h-full overflow-y-auto md:overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <Quadrant id="do" />
        <Quadrant id="schedule" />
        <Quadrant id="delegate" />
        <Quadrant id="eliminate" />
      </motion.div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
