import type { StoreState } from '../store/useStore';

export const exportState = (state: StoreState) => {
  const dataStr = JSON.stringify(state, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `eisenhower-matrix-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportStateCSV = (state: StoreState) => {
  const tasks = Object.values(state.tasks);
  if (tasks.length === 0) {
    alert('No tasks to export.');
    return;
  }

  // Define CSV headers based on Task properties
  const headers = ['id', 'title', 'quadrantId', 'completed', 'createdAt', 'updatedAt', 'order'];
  
  // Create CSV rows
  const csvRows = [
    headers.join(','), // Header row
    ...tasks.map(task => 
      headers.map(header => {
        const val = task[header as keyof typeof task];
        // Escape quotes and wrap in quotes if value contains comma, quote, or newline
        const strVal = String(val);
        if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
          return `"${strVal.replace(/"/g, '""')}"`;
        }
        return strVal;
      }).join(',')
    )
  ];

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `eisenhower-matrix-export-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importState = async (file: File): Promise<StoreState> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        
        // Validation logic
        if (!json || typeof json !== 'object') throw new Error('Invalid JSON structure');
        if (!json.tasks || typeof json.tasks !== 'object') throw new Error('Missing or invalid tasks property');
        if (!json.ui || typeof json.ui !== 'object') throw new Error('Missing or invalid ui property');
        
        // Validating a sample task if present
        const taskKeys = Object.keys(json.tasks);
        if (taskKeys.length > 0) {
          const sampleTask = json.tasks[taskKeys[0]];
          if (!sampleTask.id || !sampleTask.title || !sampleTask.quadrantId) {
            throw new Error('Tasks are missing required properties');
          }
        }
        
        resolve(json as StoreState);
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Unknown parsing error'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
