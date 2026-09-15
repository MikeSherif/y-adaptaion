import { create } from 'zustand';
interface OnboardingUiState {
  selectedStageId?: string;
  selectStage: (stageId: string) => void;
}
export const useOnboardingUiStore = create<OnboardingUiState>((set) => ({
  selectStage: (selectedStageId) => set({ selectedStageId }),
}));
