import { useState, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical, CheckCircle2, Circle, Edit2, CalendarIcon } from 'lucide-react';
import type { Task } from '../types';
import { useActions } from '../store/useStore';

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
      <div 
        className="bg-white p-4 rounded-xl shadow-md border border-stone-200 flex flex-col gap-3 mb-3 transition-all"
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
          <button 
            onClick={() => setIsEditing(false)}
            className="text-sm px-3 py-1.5 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-all font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="text-sm px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-900 text-stone-50 transition-all font-medium shadow-sm"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white p-3 sm:p-4 rounded-xl shadow-sm border mb-3 flex gap-3 items-start transition-all hover:shadow-md hover:-translate-y-[1px] ${
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

      <button
        onClick={() => toggleCompletion(task.id)}
        className={`mt-0.5 focus:outline-none focus:ring-2 focus:ring-stone-300 rounded-full transition-colors ${
          task.completed ? 'text-stone-800' : 'text-stone-300 hover:text-stone-600'
        }`}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <Circle className="w-5 h-5 sm:w-6 sm:h-6" />}
      </button>

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

      <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 flex items-center gap-1.5 transition-all">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-stone-300"
          aria-label="Edit task"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-200"
          aria-label="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
