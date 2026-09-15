import { create } from 'zustand';
import type { MaterialFilters } from '@/shared/types/domain';
interface MaterialFilterState extends MaterialFilters {
  setFilters: (filters: MaterialFilters) => void;
}
export const useMaterialFilterStore = create<MaterialFilterState>((set) => ({
  setFilters: (filters) => set(filters),
}));
