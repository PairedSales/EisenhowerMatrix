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
        className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col gap-2 mb-2"
        ref={setNodeRef}
        style={style}
      >
        <input
          autoFocus
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 text-sm bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Task title..."
        />
        <textarea
          value={editNotes}
          onChange={e => setEditNotes(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none min-h-[60px]"
          placeholder="Notes (optional)..."
        />
        <div className="flex justify-end gap-2 mt-1">
          <button 
            onClick={() => setIsEditing(false)}
            className="text-xs px-2 py-1 rounded text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="text-xs px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors font-medium"
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
      className={`group bg-white p-3 rounded-lg shadow-sm border mb-2 flex gap-2 items-start transition-colors ${
        task.completed 
          ? 'border-slate-200 opacity-60' 
          : 'border-slate-200 hover:border-slate-300'
      }`}
      aria-label={`Task: ${task.title}`}
    >
      <button
        className="mt-0.5 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        {...attributes}
        {...listeners}
        aria-label="Drag handle"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <button
        onClick={() => toggleCompletion(task.id)}
        className={`mt-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-colors ${
          task.completed ? 'text-green-500' : 'text-slate-400 hover:text-green-500'
        }`}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
      </button>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span className={`text-sm font-medium break-words ${task.completed ? 'line-through text-slate-500' : 'text-slate-700'}`}>
          {task.title}
        </span>
        {task.notes && (
          <span className="text-xs text-slate-500 line-clamp-2 break-words whitespace-pre-wrap">
            {task.notes}
          </span>
        )}
        {task.dueDate && (
          <span className="text-xs text-blue-600 flex items-center gap-1 mt-1">
            <CalendarIcon className="w-3 h-3" />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 flex items-center gap-1 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Edit task"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
