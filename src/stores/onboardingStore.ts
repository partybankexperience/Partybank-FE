import { create } from 'zustand';
import { Storage } from './InAppStorage';

// FE step enum (includes FE-only 'emailVerification')
type Step =
  | 'emailVerification'
  | 'passwordSetup'
  | 'profileInformation'
  | 'pinSetup'
  | 'createEventSeries';

type OnboardingStore = {
  completedSteps: Step[];
  markStepComplete: (step: Step) => void;
  isStepCompleted: (step: Step) => boolean;
  reset: () => void;
  updateOnboardingStep: (step: Step) => void;
};

const orderedSteps: Step[] = [
  'emailVerification',
  'passwordSetup',
  'profileInformation',
  'pinSetup',
  'createEventSeries',
];

export const useOnboardingStore = create<OnboardingStore>((set, get) => {
  // NOTE: ensure Storage.getItem('user') returns an object (parse JSON if needed in Storage)
  const user = Storage.getItem('user') || {};
  // Backend usually returns 'passwordSetup' etc.; default to FE-only 'emailVerification' when missing
  const currentStep: Step = (user?.onboardingStep as Step) || 'emailVerification';

  const currentStepIndex = orderedSteps.indexOf(currentStep);
  const completedSteps = currentStepIndex !== -1 ? orderedSteps.slice(0, currentStepIndex) : [];

  return {
    completedSteps,

    markStepComplete: (step) =>
      set((state) => {
        if (state.completedSteps.includes(step)) return state;
        // Keep in defined order & dedupe
        const updated = orderedSteps.filter((s) => state.completedSteps.includes(s) || s === step);
        Storage.setItem('completedSteps', updated);
        return { completedSteps: updated };
      }),

    isStepCompleted: (step) => get().completedSteps.includes(step),

    reset: () => {
      Storage.setItem('completedSteps', []); // optional: clear persisted progress
      set({ completedSteps: [] });
    },

    updateOnboardingStep: (step) => {
      const u = Storage.getItem('user');
      if (u) Storage.setItem('user', { ...u, onboardingStep: step });
    },
  };
});
