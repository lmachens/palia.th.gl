import { useDict } from "../components/(i18n)/i18n-provider";
import { useGlobalSettingsStore } from "../lib/storage/global-settings";
import Toggle from "./toggle";

export default function Settings() {
  const globalSettingsStore = useGlobalSettingsStore();
  const dict = useDict();

  return (
    <>
      <div className="flex">
        <span className="w-1/2">{dict.settings.showEventsTimers}</span>
        <Toggle
          checked={!!globalSettingsStore.showTimers}
          onChange={globalSettingsStore.toggleShowTimers}
        />
      </div>
      <div className="flex">
        <span className="w-1/2">{dict.settings.stackEventsTimers}</span>
        <Toggle
          checked={!!globalSettingsStore.stackTimers}
          onChange={globalSettingsStore.toggleStackTimers}
        />
      </div>
      <div className="flex">
        <span className="w-1/2">{dict.settings.showTerritoryNames}</span>
        <Toggle
          checked={!!globalSettingsStore.showTerritoryNames}
          onChange={globalSettingsStore.toggleShowTerritoryNames}
        />
      </div>
      <div className="flex">
        <span className="w-1/2">
          {dict.settings.alternativeDiscoveredWaypointsIcon}
        </span>
        <Toggle
          checked={!!globalSettingsStore.isAlternativeDiscoveredStyle}
          onChange={globalSettingsStore.toggleIsAlternativeDiscoveredStyle}
        />
      </div>
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
