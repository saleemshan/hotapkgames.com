import { create } from "zustand";

type UiState = {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  searchDraft: string;
  setSearchDraft: (q: string) => void;
};

export const useUiStore = create<UiState>((set) => ({
  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  searchDraft: "",
  setSearchDraft: (q) => set({ searchDraft: q }),
}));
