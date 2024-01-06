"use client";
import { HOTKEYS } from "@/lib/config";
import { useSettingsStore } from "@/lib/storage/settings";
import Hotkey from "./hotkey";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export default function AppSettings() {
  const settingsStore = useSettingsStore();

  return (
    <>
      <Label className="flex items-center gap-2 justify-between">
        Show/Hide app
        <Hotkey name={HOTKEYS.TOGGLE_APP} />
      </Label>
      <Label className="flex items-center gap-2 justify-between">
        Zoom in map
        <Hotkey name={HOTKEYS.ZOOM_IN_APP} />
      </Label>
      <Label className="flex items-center gap-2 justify-between">
        Zoom out map
        <Hotkey name={HOTKEYS.ZOOM_OUT_APP} />
      </Label>
      <Label className="flex items-center gap-2 justify-between">
        Lock/Unlock app
        <Hotkey name={HOTKEYS.TOGGLE_LOCK_APP} />
      </Label>
      <div className="flex items-center gap-2 justify-between">
        Reset UI positions
        <Button onClick={settingsStore.resetTransform}>Reset</Button>
      </div>
    </>
  );
}
