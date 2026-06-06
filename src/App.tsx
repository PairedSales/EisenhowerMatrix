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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col overflow-hidden text-stone-900 font-sans selection:bg-amber-100 transition-colors duration-500">
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
