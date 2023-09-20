import { create } from "zustand";
import { persist } from "zustand/middleware";
import { spawnNodes, staticNodes } from "../nodes";

export const ALL_FILTERS = [
  ...Object.keys(staticNodes),
  ...Object.keys(spawnNodes),
];

export const useGlobalSettingsStore = create(
  persist<{
    // App and Website
    iconSize: number;
    setIconSize: (iconSize: number) => void;
    filters: string[];
    setFilters: (filters: string[]) => void;
    showFilters: boolean;
    toggleShowFilters: () => void;
    showRoutes: boolean;
    toggleShowRoutes: () => void;
    showSidebar: boolean;
    toggleShowSidebar: () => void;
  }>(
    (set) => {
      let filters = ALL_FILTERS;
      if (typeof window !== "undefined" && typeof overwolf === "undefined") {
        const filtersString = new URLSearchParams(window.location.search).get(
          "filters"
        );
        if (filtersString) {
          filters = filtersString.split(",");
        }
      }

      return {
        iconSize: 1,
        setIconSize: (iconSize) => set({ iconSize }),
        filters,
        setFilters: (filters) => set({ filters: [...new Set(filters)] }),
        showFilters: false,
        toggleShowFilters: () =>
          set((state) => ({ showFilters: !state.showFilters })),
        showRoutes: false,
        toggleShowRoutes: () =>
          set((state) => ({ showRoutes: !state.showRoutes })),
        showSidebar:
          typeof document !== "undefined"
            ? document.body.clientWidth >= 768 &&
              typeof overwolf === "undefined"
            : false,
        toggleShowSidebar: () =>
          set((state) => ({
            showSidebar: !state.showSidebar,
          })),
      };
    },
    {
      name:
        typeof location !== "undefined" &&
        location.pathname.startsWith("/embed")
          ? "embed-global-settings-storage"
          : "global-settings-storage",
      merge: (persistentState: any, currentState) => {
        if (location.pathname.startsWith("/embed")) {
          return currentState;
        }
        if (
          typeof overwolf === "undefined" &&
          currentState.filters.length !== ALL_FILTERS.length
        ) {
          persistentState.filters = currentState.filters;
        }
        return { ...currentState, ...persistentState };
      },
    }
  )
);
