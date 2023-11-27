import { promisifyOverwolf } from "@/app/(overwolf)/lib/wrapper";
import Cookies from "js-cookie";
import { mutate } from "swr";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isOverwolfApp } from "../env";
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
    (set, get) => ({
      userId: null,
      isPatron: false,
      previewAccess: false,
      setIsPatron: (isPatron, userId, previewAccess) => {
        if (isOverwolfApp) {
          const prevUserId = get().userId;
          if (!prevUserId && previewAccess) {
            promisifyOverwolf(overwolf.settings.setExtensionSettings)({
              channel: "preview-access",
            }).then(() => mutate("extensionSettings"));
          } else if (prevUserId && !previewAccess) {
            promisifyOverwolf(overwolf.settings.setExtensionSettings)({
              channel: "production",
            }).then(() => mutate("extensionSettings"));
          }
        }
        set({
          isPatron,
          userId: userId || null,
          previewAccess: previewAccess || false,
        });
      },
    }),
    {
      name: "account-storage",
    }
  )
);

withStorageDOMEvents(useAccountStore);

if (typeof window !== "undefined" && !isOverwolfApp) {
  const APP_ID = "fgbodfoepckgplklpccjedophlahnjemfdknhfce";
  let userId = Cookies.get("userId");
  const refreshState = async () => {
    const state = useAccountStore.getState();
    if (!userId) {
      if (state.isPatron) {
        state.setIsPatron(false);
      }
      return;
    }

    const response = await fetch(
      `https://www.th.gl/api/patreon?appId=${APP_ID}`,
      { credentials: "include" }
    );
    try {
      const body = await response.json();
      if (!response.ok) {
        console.warn(body);
        state.setIsPatron(false);
      } else {
        console.log(`Patreon successfully activated`);
        state.setIsPatron(true, userId);
      }
    } catch (err) {
      console.error(err);
      state.setIsPatron(false);
    }
  };
  refreshState();

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      const newUserId = Cookies.get("userId");
      if (newUserId !== userId) {
        userId = newUserId;
        refreshState();
      }
    }
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);
}
