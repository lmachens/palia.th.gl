import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWeeklyWantsStore = create(
  persist<{
    finished: { version: number; id: number; villagerPersistId: number }[];
    toggleFinished: (
      villagerPersistId: number,
      id: number,
      version: number
    ) => void;
  }>(
    (set) => ({
      finished: [],
      toggleFinished: (villagerPersistId, id, version) =>
        set((state) => {
          if (
            state.finished.some(
              (v) =>
                v.villagerPersistId === villagerPersistId &&
                v.id === id &&
                v.version === version
            )
          ) {
            return {
              finished: state.finished.filter(
                (v) =>
                  v.villagerPersistId !== villagerPersistId ||
                  v.id !== id ||
                  v.version !== version
              ),
            };
          } else {
            return {
              finished: [...state.finished, { villagerPersistId, id, version }],
            };
          }
        }),
    }),
    {
      name: "weekly-wants-storage",
      version: 2,
    }
  )
);
