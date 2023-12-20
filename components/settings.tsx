"use client";
import { useSettingsStore } from "@/lib/storage/settings";
import { useDict } from "../components/(i18n)/i18n-provider";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";

export default function Settings() {
  const settingsStore = useSettingsStore();
  const dict = useDict();

  return (
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
  );
}
