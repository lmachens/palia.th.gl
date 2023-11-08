import { promisifyOverwolf } from "@/app/(overwolf)/lib/wrapper";
import { mutate } from "swr";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { withStorageDOMEvents } from "./dom";

export const useAccountStore = create(
  persist<{
    userId: string | null;
    isPatron: boolean;
    previewAccess: boolean;
    setIsPatron: (
      isPatron: boolean,
      userId?: string | null,
      previewAccess?: boolean
    ) => void;
  }>(
    (set) => ({
      userId: null,
      isPatron: false,
      previewAccess: false,
      setIsPatron: (isPatron, userId, previewAccess) => {
        set({
          isPatron,
          userId: userId || null,
          previewAccess: previewAccess || false,
        });
        promisifyOverwolf(overwolf.settings.setExtensionSettings)({
          channel: previewAccess ? "preview-access" : "production",
        }).then(() => mutate("extensionSettings"));
      },
    }),
    {
      name: "account-storage",
    }
  )
);

withStorageDOMEvents(useAccountStore);
