import { create } from 'zustand';
interface AppState {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}
export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));
