import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isOverwolfApp } from "../env";

export const useGlobalSettingsStore = create(
  persist<{
    showFilters: boolean | null;
    toggleShowFilters: () => void;
    showRoutes: boolean;
    toggleShowRoutes: () => void;
    showSidebar: boolean;
    toggleShowSidebar: () => void;
  }>(
    (set) => {
      return {
        showFilters: null,
        toggleShowFilters: () =>
          set((state) => ({
            showFilters:
              state.showFilters === null
                ? !window.matchMedia("(min-width: 768px)").matches
                : !state.showFilters,
          })),
        showRoutes: false,
        toggleShowRoutes: () =>
          set((state) => ({ showRoutes: !state.showRoutes })),
        showSidebar: false,
        toggleShowSidebar: () =>
          set((state) => ({
            showSidebar: !state.showSidebar,
          })),
      };
    },
    {
      name: "global-settings-storage",
      skipHydration: !isOverwolfApp,
      merge: (persistentState: any, currentState) => {
        if (!isOverwolfApp) {
          return currentState;
        }
        return { ...currentState, ...persistentState };
      },
    }
  )
);
