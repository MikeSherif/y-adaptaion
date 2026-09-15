import { create } from 'zustand';
import type { TaskFilters } from '@/shared/types/domain';
interface TaskFilterState extends TaskFilters {
  setFilters: (filters: TaskFilters) => void;
}
export const useTaskFilterStore = create<TaskFilterState>((set) => ({
  setFilters: (filters) => set(filters),
}));
