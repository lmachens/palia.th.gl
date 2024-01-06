"use client";
import { useSettingsStore } from "@/lib/storage/settings";
import { useDict } from "../components/(i18n)/i18n-provider";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";

export default function Settings() {
  const settingsStore = useSettingsStore();
  const dict = useDict();

  return (
    <>
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
      <Label className="flex items-center gap-2 justify-between">
        {dict.settings.iconSize}
        <Slider
          className="w-32"
          value={[settingsStore.iconSize]}
          min={0.4}
          max={2}
          step={0.1}
          onValueChange={(value) => settingsStore.setIconSize(value[0])}
        />
      </Label>
    </>
  );
}
