import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useStore as useZustandStore } from 'zustand';
import { Upload, Trash2, Plus, FileJson, FileText, Undo2, Redo2 } from 'lucide-react';
import { toast } from 'sonner';
import { useStore, useActions, useUI } from '../store/useStore';
import { exportState, exportStateCSV, importState } from '../utils/exportImport';
import { SearchBar } from './SearchBar';

export const Toolbar = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const state = useStore(state => state);
  const { clearCompleted, importState: loadState, addTask, setShowCompleted } = useActions();
  const { showCompleted } = useUI();


  const handleExportJSON = () => {
    exportState(state);
  };

  const handleExportCSV = () => {
    exportStateCSV(state);
  };
  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const newState = await importState(file);
      loadState(newState);
      toast.success('Data imported successfully');
    } catch (err) {
      alert(`Failed to import: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const pastStates = useZustandStore(useStore.temporal, (state) => state.pastStates);
  const futureStates = useZustandStore(useStore.temporal, (state) => state.futureStates);
  const undo = useZustandStore(useStore.temporal, (state) => state.undo);
  const redo = useZustandStore(useStore.temporal, (state) => state.redo);

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
          
          <button
            onClick={() => undo()}
            disabled={pastStates.length === 0}
            className="p-2 text-stone-500 hover:text-stone-800 disabled:opacity-30 disabled:hover:bg-transparent hover:bg-stone-100/50 rounded-lg transition-all"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => redo()}
            disabled={futureStates.length === 0}
            className="p-2 text-stone-500 hover:text-stone-800 disabled:opacity-30 disabled:hover:bg-transparent hover:bg-stone-100/50 rounded-lg transition-all"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
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
            className="flex items-center gap-1 p-2 text-sm font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100/50 rounded-lg transition-all"
            title="Import Data (JSON)"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import</span>
          </button>
          <div className="w-px h-4 bg-stone-200 mx-1 hidden sm:block"></div>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1 p-2 text-sm font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100/50 rounded-lg transition-all"
            title="Export Data (JSON)"
          >
            <FileJson className="w-4 h-4" />
            <span className="hidden sm:inline">JSON</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 p-2 text-sm font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100/50 rounded-lg transition-all"
            title="Export Data (CSV)"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">CSV</span>
          </button>
          <div className="w-px h-4 bg-stone-200 mx-1 hidden sm:block"></div>
          <button
            onClick={clearCompleted}
            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50/50 rounded-full transition-all"
            title="Clear Completed Tasks"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
};
