import { Search } from 'lucide-react';
import { useUI, useActions } from '../store/useStore';

export const SearchBar = () => {
  const searchQuery = useUI().searchQuery;
  const { setSearchQuery } = useActions();

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-slate-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-4 py-2.5 border-0 rounded-xl leading-5 bg-white/60 backdrop-blur-sm shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white text-stone-800 sm:text-sm transition-all"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};
