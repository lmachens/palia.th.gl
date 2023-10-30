import { create } from "zustand";
import { persist } from "zustand/middleware";
import { withStorageDOMEvents } from "./dom";

export const useAccountStore = create(
  persist<{
    userId: string | null;
    isPatron: boolean;
    setIsPatron: (isPatron: boolean, userId?: string | null) => void;
  }>(
    (set) => ({
      userId: null,
      isPatron: false,
      setIsPatron: (isPatron, userId) =>
        set({ isPatron, userId: userId || null }),
    }),
    {
      name: "account-storage",
    }
  )
);

withStorageDOMEvents(useAccountStore);
