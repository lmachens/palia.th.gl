import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isOverwolfApp } from "../env";
import { withStorageDOMEvents } from "./dom";

export const useSettingsStore = create(
  persist<{
    liveMode: boolean;
    setLiveMode: (liveMode: boolean) => void;
    iconSize: number;
    setIconSize: (iconSize: number) => void;
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
    traceLineLength: number;
    setTraceLineLength: (traceLineLength: number) => void;
    adTransform: string;
    setAdTransform: (adTransform: string) => void;
    mapTransform: Record<string, string>;
    setMapTransform: (mapTransform: Record<string, string>) => void;
    resetTransform: () => void;
  }>(
    (set) => {
      const defaultMapTransform = {
        transform: `translate(${
          (typeof window !== "undefined" ? window.innerWidth : 1600) - 520
        }px, 20px)`,
        width: "500px",
        height: "330px",
      };
      return {
        liveMode: isOverwolfApp ? true : false,
        setLiveMode: (liveMode) => set({ liveMode }),
        iconSize: 1,
        setIconSize: (iconSize) => set({ iconSize }),
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
        traceLineLength: 100,
        setTraceLineLength: (traceLineLength) => set({ traceLineLength }),
        adTransform: "",
        setAdTransform: (adTransform) => set({ adTransform }),
        mapTransform: defaultMapTransform,
        setMapTransform: (mapTransform) => set({ mapTransform }),
        resetTransform: () => {
          set({
            adTransform: "",
            mapTransform: defaultMapTransform,
          });
        },
      };
    },
    {
      name: "settings-storage",
    }
  )
);

withStorageDOMEvents(useSettingsStore);
