type ModuleKey = { courseSlug: string; moduleIndex: number };
const KEY = "academy:progress:v1";

export type ProgressState = {
  // courseSlug -> Set of completed module indices
  completed: Record<string, number[]>;
};

function read(): ProgressState {
  if (typeof window === 'undefined') return { completed: {} }; // Server-side safety
  try { return JSON.parse(localStorage.getItem(KEY) || '{"completed":{}}'); }
  catch { return { completed: {} }; }
}
function write(state: ProgressState) { 
  if (typeof window === 'undefined') return; // Server-side safety
  localStorage.setItem(KEY, JSON.stringify(state)); 
}

export function isModuleDone(courseSlug: string, moduleIndex: number) {
  if (typeof window === 'undefined') return false; // Server-side safety
  const s = read(); return (s.completed[courseSlug] || []).includes(moduleIndex);
}
export function markModuleDone(courseSlug: string, moduleIndex: number) {
  if (typeof window === 'undefined') return; // Server-side safety
  const s = read(); const arr = new Set(s.completed[courseSlug] || []);
  arr.add(moduleIndex); s.completed[courseSlug] = Array.from(arr); write(s);
}
export function courseProgressPercent(courseSlug: string, totalModules: number) {
  if (typeof window === 'undefined') return 0; // Server-side safety
  const s = read(); const done = (s.completed[courseSlug] || []).length;
  return totalModules ? Math.min(100, Math.round((done / totalModules) * 100)) : 0;
}
