// stores/useProfileSectionStore.ts
import { create } from "zustand";

interface ProfileSectionStore {
  section: string | null;
  setSection: (section: string | null) => void;
}

export const useProfileSectionStore = create<ProfileSectionStore>((set) => ({
  section: null,
  setSection: (section) => set({ section }),
}));
