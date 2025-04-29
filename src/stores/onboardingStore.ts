import { create } from "zustand";
import { Storage } from "./InAppStorage";

type OnboardingStore = {
  completedSteps: string[];
  markStepComplete: (step: string) => void;
  isStepCompleted: (step: string) => boolean;
  reset: () => void;
};

const orderedSteps = [
  "emailVerification",
  "passwordSetup",
  "profileInformation",
  "pinSetup",
  "createEventSeries",
];

export const useOnboardingStore = create<OnboardingStore>((set, get) => {
  // Get user info from storage
  const user = Storage.getItem("user") || {};
  const currentStep = user?.onboardingStep || "emailVerification";

  // Figure out all steps *before* and including the current one
  const currentStepIndex = orderedSteps.indexOf(currentStep);
  const completedSteps = currentStepIndex !== -1
    ? orderedSteps.slice(0, currentStepIndex)
    : [];

  return {
    completedSteps,
    markStepComplete: (step) => {
      set((state) => {
        if (state.completedSteps.includes(step)) {
          return state; // already completed
        }
        const updatedSteps = [...state.completedSteps, step];
        Storage.setItem("completedSteps", updatedSteps); // (Optional) still persist
        return { completedSteps: updatedSteps };
      });
    },
    isStepCompleted: (step) => get().completedSteps.includes(step),
    reset: () => set({ completedSteps: [] }),
  };
});
