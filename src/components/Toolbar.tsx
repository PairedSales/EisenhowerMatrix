import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Download, Upload, Trash2, Plus } from 'lucide-react';
import { useStore, useActions, useUI } from '../store/useStore';
import { exportState, importState } from '../utils/exportImport';
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
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 bg-stone-50/80 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-800 hidden sm:block">Eisenhower</h1>
        
        <div className="flex-1 w-full sm:w-auto max-w-md">
          <SearchBar />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
            <input 
              type="checkbox" 
              checked={showCompleted} 
              onChange={(e) => setShowCompleted(e.target.checked)} 
              className="rounded border-stone-300 text-stone-600 focus:ring-stone-500 transition-all cursor-pointer"
            />
            Show Completed
          </label>
          <div className="w-px h-6 bg-stone-200 mx-2 hidden sm:block"></div>
          
          <input
            type="file"
            accept=".json"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImport}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100/50 rounded-full transition-all"
            title="Import Data"
          >
            <Upload className="w-5 h-5" />
          </button>
          <button
            onClick={handleExport}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100/50 rounded-full transition-all"
            title="Export Data"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={clearCompleted}
            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50/50 rounded-full transition-all"
            title="Clear Completed Tasks"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <form onSubmit={handleQuickAdd} className="flex gap-3 max-w-2xl mx-auto w-full">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="What's on your mind?"
          className="flex-1 px-4 py-3 bg-white/60 backdrop-blur-sm border-0 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all text-stone-800 placeholder:text-stone-400"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-800 hover:bg-stone-900 text-stone-50 rounded-xl transition-all shadow-sm hover:shadow font-medium whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>
    </div>
  );
};
