import { useEffect, useState } from 'react';
import { Toolbar } from './components/Toolbar';
import { MatrixBoard } from './components/MatrixBoard';
import { useStore } from './store/useStore';

function App() {
  const _hasHydrated = useStore(state => state.ui._hasHydrated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !_hasHydrated) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden transition-colors duration-200 text-slate-900 dark:text-slate-100">
      <Toolbar />
      <main className="flex-1 overflow-hidden">
        <MatrixBoard />
      </main>
    </div>
  );
}

export default App;
