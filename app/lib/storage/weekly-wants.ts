import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWeeklyWantsStore = create(
  persist<{
    finished: { version: number; id: string; villagerId: string }[];
    toggleFinished: (villagerId: string, id: string, version: number) => void;
  }>(
    (set) => ({
      finished: [],
      toggleFinished: (villagerId, id, version) =>
        set((state) => {
          if (
            state.finished.some(
              (v) =>
                v.villagerId === villagerId &&
                v.id === id &&
                v.version === version
            )
          ) {
            return {
              finished: state.finished.filter(
                (v) =>
                  v.villagerId !== villagerId ||
                  v.id !== id ||
                  v.version !== version
              ),
            };
          } else {
            return {
              finished: [...state.finished, { villagerId, id, version }],
            };
          }
        }),
    }),
    {
      name: "weekly-wants-storage",
    }
  )
);
