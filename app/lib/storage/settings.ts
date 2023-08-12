import { create } from "zustand";
import { persist } from "zustand/middleware";
import { withStorageDOMEvents } from "./dom";

export const useSettingsStore = create(
  persist<{
    overlayMode: boolean;
    setOverlayMode: (overlayMode: boolean) => void;
    mapFilter: string;
    setMapFilter: (mapFilter: string) => void;
    windowOpacity: number;
    setWindowOpacity: (windowOpacity: number) => void;
    lockedWindow: boolean;
    toggleLockedWindow: () => void;
    locale: string;
    setLocale: (locale: string) => void;
    followPlayerPosition: boolean;
    toggleFollowPlayerPosition: () => void;
    showTraceLine: boolean;
    toggleShowTraceLine: () => void;
    adTransform: string;
    setAdTransform: (adTransform: string) => void;
    mapTransform: Record<string, string>;
    setMapTransform: (mapTransform: Record<string, string>) => void;
    resetTransform: () => void;
  }>(
    (set) => {
      return {
        overlayMode: true,
        setOverlayMode: (overlayMode) =>
          set({
            overlayMode,
          }),
        mapFilter: "none",
        setMapFilter: (mapFilter) => set({ mapFilter }),
        windowOpacity: 1,
        setWindowOpacity: (windowOpacity) => set({ windowOpacity }),
        lockedWindow: false,
        toggleLockedWindow: () =>
          set((state) => ({ lockedWindow: !state.lockedWindow })),
        locale: "en",
        setLocale: (locale) => set({ locale }),
        followPlayerPosition: true,
        toggleFollowPlayerPosition: () =>
          set((state) => ({
            followPlayerPosition: !state.followPlayerPosition,
          })),
        showTraceLine: true,
        toggleShowTraceLine: () =>
          set((state) => ({ showTraceLine: !state.showTraceLine })),
        adTransform: "",
        setAdTransform: (adTransform) => set({ adTransform }),
        mapTransform: {
          transform: "translate(7px, 70px)",
          width: "500px",
          height: "330px",
        },
        setMapTransform: (mapTransform) => set({ mapTransform }),
        resetTransform: () => {
          set({
            adTransform: "",
            mapTransform: {
              transform: "translate(7px, 70px)",
              width: "500px",
              height: "330px",
            },
          });
        },
      };
    },
    {
      name: "settings-storage",
    },
  ),
);

withStorageDOMEvents(useSettingsStore);
