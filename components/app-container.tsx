import { useGameInfoStore } from "@/lib/storage/game-info";
import { useSettingsStore } from "@/lib/storage/settings";
import { setInputPassThrough } from "@/lib/windows";
import type { ReactNode } from "react";
import { useEffect } from "react";

export default function AppContainer({ children }: { children: ReactNode }) {
  const settingsStore = useSettingsStore();
  const isOverlay = useGameInfoStore((state) => state.isOverlay);

  useEffect(() => {
    if (isOverlay) {
      setInputPassThrough(settingsStore.lockedWindow);
    }
  }, [settingsStore.lockedWindow]);

  return (
    <div
      className={`h-screen flex flex-col text-white app antialiased select-none overflow-hidden ${
        isOverlay ? (settingsStore.lockedWindow ? "locked" : "") : "bg-black"
      }`}
      style={
        isOverlay
          ? {
              willChange: "opacity",
              opacity: settingsStore.windowOpacity.toFixed(2),
            }
          : {}
      }
    >
      {children}
    </div>
  );
}
