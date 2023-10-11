import { create } from "zustand";
import { persist } from "zustand/middleware";
import { withStorageDOMEvents } from "./dom";

export const useAccountStore = create(
  persist<{
    isPatron: boolean;
    setIsPatron: (isPatron: boolean) => void;
  }>(
    (set) => ({
      isPatron: false,
      setIsPatron: (isPatron) => set({ isPatron }),
    }),
    {
      name: "account-storage",
    }
  )
);

withStorageDOMEvents(useAccountStore);
