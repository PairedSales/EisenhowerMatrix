import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Download, Upload, Trash2, Plus } from 'lucide-react';
import { useStore, useActions, useUI } from '../store/useStore';
import { exportState, importState } from '../utils/exportImport';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';

export const Toolbar = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const state = useStore(state => state);
  const { clearCompleted, importState: loadState, addTask, setShowCompleted } = useActions();
  const { showCompleted } = useUI();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleExport = () => {
    exportState(state);
  };

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const newState = await importState(file);
      loadState(newState);
    } catch (err) {
      alert(`Failed to import: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleQuickAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle.trim(), 'do');
    setNewTaskTitle('');
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 hidden sm:block">Eisenhower Matrix</h1>
        
        <div className="flex-1 w-full sm:w-auto max-w-md">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
            <input 
              type="checkbox" 
              checked={showCompleted} 
              onChange={(e) => setShowCompleted(e.target.checked)} 
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Show Completed
          </label>
          <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-2 hidden sm:block"></div>
          
          <input
            type="file"
            accept=".json"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImport}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="Import Data"
          >
            <Upload className="w-5 h-5" />
          </button>
          <button
            onClick={handleExport}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="Export Data"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={clearCompleted}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="Clear Completed Tasks"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          
          <ThemeToggle />
        </div>
      </div>
      
      <form onSubmit={handleQuickAdd} className="flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Quick add task..."
          className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>
    </div>
  );
};
