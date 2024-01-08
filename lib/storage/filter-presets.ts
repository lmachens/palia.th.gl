import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useParamsStore } from "@/lib/storage/params";

export type FILTER_PRESET = {
  id: string;
  name: string;
  filters: string[];
};
const EMPTY_FILTER_PRESET: FILTER_PRESET = {
  id: "",
  name: "",
  filters: [],
};
export const useFilterPresetsStore = create(
  persist<{
    isCreating: boolean;
    setIsCreating: (isCreating: boolean) => void;
    presets: FILTER_PRESET[];
    addPreset: (preset: FILTER_PRESET) => void;
    removePreset: (presetId : string) => void;
    activePresets: string[];
    activatePreset: (presetId: string) => void;
    deactivatePreset: (presetId: string) => void;
  }>(
    (set) => ({
      isCreating: false,
      setIsCreating: (isCreating) => set({ isCreating }),
      presets: [],
      addPreset: (preset) =>
      set((state) => ({
        presets: [...state.presets, preset],
        activePresets: [...state.activePresets, preset.id],
      })),
      removePreset: (presetId) =>
      set((state) => ({
        presets: state.presets.filter((preset) => preset.id !== presetId),
        activePresets: state.activePresets.filter((id) => id !== presetId),
      })),
      activePresets: [],
      activatePreset: (presetId) =>
      set((state) => ({
        activePresets: [...state.activePresets, presetId],
      })),
      deactivatePreset: (presetId) =>
      set((state) => ({
        activePresets: state.activePresets.filter((id) => id !== presetId),
      }))
    }),
    {
      name: "filter-presets-storage",
    }
  )
);
