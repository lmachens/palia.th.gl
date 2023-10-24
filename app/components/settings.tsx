import { useDict } from "../components/(i18n)/i18n-provider";
import { useSettingsStore } from "../lib/storage/settings";

export default function Settings() {
  const settingsStore = useSettingsStore();
  const dict = useDict();

  return (
    <label className="flex">
      <span className="w-1/2">{dict.settings.iconSize}</span>
      <input
        className="w-5/12"
        type="range"
        value={settingsStore.iconSize}
        min={0.4}
        max={2}
        step={0.1}
        onChange={(event) => settingsStore.setIconSize(+event.target.value)}
      />
    </label>
  );
}
