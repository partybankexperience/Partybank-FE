import { create } from "zustand";
import { Storage } from "./InAppStorage";

type OnboardingStore = {
  completedSteps: string[];
  markStepComplete: (step: string) => void;
  isStepCompleted: (step: string) => boolean;
};

export const useOnboardingStore = create<OnboardingStore>((set, get) => {
  // Load persisted state from localStorage
  const storedSteps = Storage.getItem("completedSteps") || [];

  return {
    completedSteps: storedSteps,
    markStepComplete: (step) => {
      // Add the step to the completedSteps array
      set((state) => {
        const updatedSteps = state.completedSteps.includes(step)
          ? state.completedSteps
          : [...state.completedSteps, step];
        // Persist the updated list to localStorage
        Storage.setItem("completedSteps", updatedSteps);
        return { completedSteps: updatedSteps };
      });
    },
    isStepCompleted: (step) => get().completedSteps.includes(step),
  };
});
