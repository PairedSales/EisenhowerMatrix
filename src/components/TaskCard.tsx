import { useState, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical, CheckCircle2, Circle, Edit2, CalendarIcon } from 'lucide-react';
import type { Task } from '../types';
import { useActions } from '../store/useStore';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'Task', task } });

  const { toggleCompletion, deleteTask, editTask } = useActions();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editNotes, setEditNotes] = useState(task.notes || '');

  useEffect(() => {
    if (!isEditing) {
      setEditTitle(task.title);
      setEditNotes(task.notes || '');
    }
  }, [task, isEditing]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      editTask(task.id, { title: editTitle.trim(), notes: editNotes.trim() || undefined });
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(task.title);
      setEditNotes(task.notes || '');
    }
  };

  if (isEditing) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
        className="bg-white p-4 rounded-xl shadow-md border border-stone-200 flex flex-col gap-3 mb-3"
        ref={setNodeRef}
        style={style}
      >
        <input
          autoFocus
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 text-base font-medium bg-stone-50/50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all text-stone-800"
          placeholder="Task title..."
        />
        <textarea
          value={editNotes}
          onChange={e => setEditNotes(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 text-sm bg-stone-50/50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none min-h-[80px] transition-all text-stone-600"
          placeholder="Notes (optional)..."
        />
        <div className="flex justify-end gap-2 mt-1">
          <motion.button 
            whileHover={{ backgroundColor: '#f5f5f4' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(false)}
            className="text-sm px-3 py-1.5 rounded-lg text-stone-500 font-medium"
          >
            Cancel
          </motion.button>
          <motion.button 
            whileHover={{ backgroundColor: '#1c1917', scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="text-sm px-4 py-1.5 rounded-lg bg-stone-800 text-stone-50 font-medium shadow-sm"
          >
            Save
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
      ref={setNodeRef}
      style={style}
      className={`group bg-white p-3 sm:p-4 rounded-xl shadow-sm border mb-3 flex gap-3 items-start ${
        task.completed 
          ? 'border-stone-100 opacity-60 bg-stone-50/50' 
          : 'border-stone-100 hover:border-stone-200'
      }`}
      aria-label={`Task: ${task.title}`}
    >
      <button
        className="mt-0.5 text-stone-300 hover:text-stone-500 cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-stone-300 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        {...attributes}
        {...listeners}
        aria-label="Drag handle"
      >
        <GripVertical className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={() => toggleCompletion(task.id)}
        className={`mt-0.5 focus:outline-none focus:ring-2 focus:ring-stone-300 rounded-full transition-colors ${
          task.completed ? 'text-stone-800' : 'text-stone-300 hover:text-stone-600'
        }`}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <Circle className="w-5 h-5 sm:w-6 sm:h-6" />}
      </motion.button>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5 pt-0.5">
        <span className={`text-base font-medium break-words transition-colors ${task.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>
          {task.title}
        </span>
        {task.notes && (
          <span className="text-sm text-stone-500 line-clamp-2 break-words whitespace-pre-wrap leading-relaxed">
            {task.notes}
          </span>
        )}
        {task.dueDate && (
          <span className="text-xs text-stone-500 flex items-center gap-1.5 mt-1 font-medium">
            <CalendarIcon className="w-3.5 h-3.5" />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 flex items-center gap-1.5 transition-opacity duration-200">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsEditing(true)}
          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-stone-300"
          aria-label="Edit task"
        >
          <Edit2 className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => deleteTask(task.id)}
          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
          aria-label="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};
