import { useDict } from "../components/(i18n)/i18n-provider";
import { useGlobalSettingsStore } from "../lib/storage/global-settings";

export default function Settings() {
  const globalSettingsStore = useGlobalSettingsStore();
  const dict = useDict();

  return (
    <>
      <div className="flex">
        <span className="w-1/2">{dict.settings.iconSize}</span>
        <input
          className="w-5/12"
          type="range"
          value={globalSettingsStore.iconSize}
          min={0.4}
          max={2}
          step={0.1}
          onChange={(event) =>
            globalSettingsStore.setIconSize(+event.target.value)
          }
        />
      </div>
    </>
  );
}
