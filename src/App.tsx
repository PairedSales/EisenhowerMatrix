import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Toolbar } from './components/Toolbar';
import { MatrixBoard } from './components/MatrixBoard';
import { useStore } from './store/useStore';

function App() {
  const _hasHydrated = useStore(state => state.ui._hasHydrated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          if (useStore.temporal.getState().futureStates.length > 0) {
            useStore.temporal.getState().redo();
            toast.success('Redo successful');
          }
        } else {
          if (useStore.temporal.getState().pastStates.length > 0) {
            useStore.temporal.getState().undo();
            toast.success('Undo successful');
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        if (useStore.temporal.getState().futureStates.length > 0) {
          useStore.temporal.getState().redo();
          toast.success('Redo successful');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!mounted || !_hasHydrated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col overflow-hidden text-stone-900 font-sans selection:bg-amber-100 transition-colors duration-500">
      <Toaster 
        position="bottom-right" 
        toastOptions={{ 
          className: 'bg-stone-50 border-stone-200 text-stone-800 shadow-lg rounded-xl',
          actionButtonStyle: { background: '#292524', color: '#fafaf9', borderRadius: '8px' }
        }} 
      />
      <Toolbar />
      <main className="flex-1 overflow-hidden px-4 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8 flex flex-col">
        <div className="flex-1 max-w-7xl mx-auto w-full h-full">
          <MatrixBoard />
        </div>
      </main>
    </div>
  );
}

export default App;
