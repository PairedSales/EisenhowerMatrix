import { X, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { useUI, useActions } from '../store/useStore';
import { useCompletedTasks } from '../store/selectors';
import { formatTimeTaken, formatDateString } from '../utils/dateUtils';

export const CompletedTasksOverlay = () => {
  const { isCompletedOverlayOpen } = useUI();
  const { setIsCompletedOverlayOpen } = useActions();
  const completedTasks = useCompletedTasks();

  if (!isCompletedOverlayOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-stone-800">Completed Tasks</h2>
              <p className="text-sm text-stone-500">{completedTasks.length} task{completedTasks.length !== 1 ? 's' : ''} finished</p>
            </div>
          </div>
          <button
            onClick={() => setIsCompletedOverlayOpen(false)}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {completedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-stone-400">
              <CheckCircle2 className="w-12 h-12 mb-4 opacity-20" />
              <p>No completed tasks yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <div 
                  key={task.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-stone-800 truncate mb-1">{task.title}</h3>
                    {task.notes && (
                      <p className="text-sm text-stone-500 line-clamp-1 mb-2">{task.notes}</p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-stone-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Completed {formatDateString(task.completedAt || task.updatedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Time taken: {formatTimeTaken(task.createdAt, task.completedAt || task.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
