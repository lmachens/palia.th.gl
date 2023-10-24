"use client";
import Toggle from "@/app/components/toggle";
import { useSettingsStore } from "@/app/lib/storage/settings";
import { HOTKEYS } from "../lib/config";
import Hotkey from "./hotkey";

export default function AppSettings() {
  const settingsStore = useSettingsStore();

  return (
    <>
      <div className="flex">
        <span className="w-1/2">Show/Hide app</span>
        <Hotkey name={HOTKEYS.TOGGLE_APP} />
      </div>
      <div className="flex">
        <span className="w-1/2">Zoom in map</span>
        <Hotkey name={HOTKEYS.ZOOM_IN_APP} />
      </div>
      <div className="flex">
        <span className="w-1/2">Zoom out map</span>
        <Hotkey name={HOTKEYS.ZOOM_OUT_APP} />
      </div>
      <div className="flex">
        <span className="w-1/2">Lock/Unlock app</span>
        <Hotkey name={HOTKEYS.TOGGLE_LOCK_APP} />
      </div>
      <div className="flex">
        <span className="w-1/2">Follow Player position</span>
        <Toggle
          checked={settingsStore.followPlayerPosition}
          onChange={settingsStore.toggleFollowPlayerPosition}
        />
      </div>
      <div className="flex">
        <span className="w-1/2">Show Trace Line</span>
        <Toggle
          checked={settingsStore.showTraceLine}
          onChange={settingsStore.toggleShowTraceLine}
        />
      </div>
      <div className="flex">
        <span className="w-1/2">Trace Line Length</span>
        <input
          className="rounded border text-white bg-neutral-800 p-1 text-xs font-mono"
          type="number"
          value={settingsStore.traceLineLength}
          min={0}
          max={10000}
          step={1}
          onChange={(event) =>
            settingsStore.setTraceLineLength(+event.target.value)
          }
        />
      </div>
      <div className="flex">
        <span className="w-1/2">Reset UI positions</span>
        <button
          className="py-1 px-2 text-sm uppercase text-white bg-neutral-800 hover:bg-neutral-700"
          onClick={settingsStore.resetTransform}
        >
          Reset
        </button>
      </div>
    </>
  );
}
