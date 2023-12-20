"use client";
import { HOTKEYS } from "@/lib/config";
import { useSettingsStore } from "@/lib/storage/settings";
import { useDict } from "./(i18n)/i18n-provider";
import Hotkey from "./hotkey";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

export default function AppSettings() {
  const settingsStore = useSettingsStore();
  const dict = useDict();

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
      <Label className="flex items-center gap-2 justify-between">
        {dict.settings.alwaysShowStarredNodes}
        <Switch
          checked={settingsStore.alwaysShowStarredNodes}
          onCheckedChange={settingsStore.toggleAlwaysShowStarredNodes}
        />
      </Label>
      <Label className="flex items-center gap-2 justify-between">
        Follow Player position
        <Switch
          checked={settingsStore.followPlayerPosition}
          onCheckedChange={settingsStore.toggleFollowPlayerPosition}
        />
      </Label>
      <Label className="flex items-center gap-2 justify-between">
        Show Trace Line
        <Switch
          checked={settingsStore.showTraceLine}
          onCheckedChange={settingsStore.toggleShowTraceLine}
        />
      </Label>
      <Label className="flex items-center gap-2 justify-between">
        Trace Line Length
        <Input
          className="w-32"
          type="number"
          value={settingsStore.traceLineLength}
          min={0}
          max={10000}
          step={1}
          onChange={(event) =>
            settingsStore.setTraceLineLength(+event.target.value)
          }
        />
      </Label>
      <div className="flex items-center gap-2 justify-between">
        Reset UI positions
        <Button onClick={settingsStore.resetTransform}>Reset</Button>
      </div>
    </>
  );
}
