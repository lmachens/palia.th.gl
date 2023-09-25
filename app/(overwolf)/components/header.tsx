"use client";
import { useGameInfoStore } from "@/app/lib/storage/game-info";
import { useSettingsStore } from "@/app/lib/storage/settings";
import { useLayoutEffect, useState } from "react";
import {
  closeMainWindow,
  maximizeWindow,
  togglePreferedWindow,
  useCurrentWindow,
} from "../lib/windows";
import HeaderSelect from "./header-select";
import HeaderToggle from "./header-toggle";
import SVGIcons from "./svg-icons";

export default function Header() {
  const currentWindow = useCurrentWindow();
  const [version, setVersion] = useState("");
  const settingsStore = useSettingsStore();

  const isMaximized = currentWindow?.stateEx === "maximized";
  const isOverlay = useGameInfoStore((state) => state.isOverlay);

  useLayoutEffect(() => {
    overwolf.extensions.current.getManifest((manifest) => {
      setVersion(manifest.meta.version);
    });

    if (isOverlay && currentWindow?.stateEx === "normal") {
      maximizeWindow(currentWindow.id);
    }
  }, [currentWindow]);

  if (isOverlay && settingsStore.lockedWindow) {
    return (
      <>
        <SVGIcons />
        <button
          className="px-1 lock flex items-center fixed z-10 text-red-500 hover:text-red-400 bg-opacity-5 bg-black"
          onClick={settingsStore.toggleLockedWindow}
        >
          <svg className="h-[28px] w-[28px] p-1">
            <use xlinkHref="#icon-lock-open" />
          </svg>
        </button>
        <header className="h-[30px]">
          <div className="h-[30px]" />
        </header>
      </>
    );
  }
  return (
    <>
      <SVGIcons />
      <header
        className={`hidden md:flex items-center h-[30px] relative bg-neutral-800 ${
          isOverlay ? "bg-opacity-50 w-fit" : ""
        }`}
        onMouseDown={() =>
          isMaximized ? null : overwolf.windows.dragMove(currentWindow!.id)
        }
        onDoubleClick={() =>
          isOverlay
            ? null
            : isMaximized
            ? overwolf.windows.restore(currentWindow!.id)
            : overwolf.windows.maximize(currentWindow!.id)
        }
      >
        <h1 className="font-mono ml-2 truncate">Palia Map v{version}</h1>
        <a
          href="https://discord.com/invite/NTZu8Px"
          target="_blank"
          className="ml-2 h-[30px] w-[30px] flex items-center hover:bg-[#7289da]"
        >
          <svg>
            <use xlinkHref="#window-control_discord" />
          </svg>
        </a>
        <div className={`flex ${isOverlay ? "ml-2" : "ml-auto"}`}>
          <div className="flex space-x-2">
            <HeaderToggle
              label="2nd Screen Mode"
              checked={!settingsStore.overlayMode}
              onChange={(checked) => {
                settingsStore.setOverlayMode(!checked);
                togglePreferedWindow();
              }}
            />
            {isOverlay && (
              <>
                <HeaderSelect
                  label="Transparency"
                  options={[
                    { label: "None", value: "none" },
                    { label: "Greyscale", value: "greyscale" },
                    { label: "Colorful", value: "colorful" },
                    { label: "Full", value: "full" },
                  ]}
                  value={settingsStore.mapFilter}
                  onChange={settingsStore.setMapFilter}
                />
                <label className="flex items-center">
                  <span className="text-xs font-mono truncate">Opacity</span>
                  <input
                    className="ml-2 w-16"
                    onMouseDown={(event) => event.stopPropagation()}
                    type="range"
                    step={0.05}
                    min={0.25}
                    max={1}
                    value={settingsStore.windowOpacity}
                    onChange={(event) =>
                      settingsStore.setWindowOpacity(+event.target.value)
                    }
                  />
                </label>
                <button
                  className="flex items-center px-1 hover:bg-neutral-700 truncate"
                  title="Lock window control"
                  onClick={settingsStore.toggleLockedWindow}
                >
                  <span className="text-xs font-mono">Lock Controls</span>
                  <svg className="h-[28px] w-[28px] p-1">
                    <use xlinkHref="#icon-lock" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {!isOverlay ? (
            <>
              <button
                className="h-[30px] w-[30px] flex items-center hover:bg-neutral-700"
                onClick={() => overwolf.windows.minimize(currentWindow!.id)}
              >
                <svg>
                  <use xlinkHref="#window-control_minimize" />
                </svg>
              </button>
              {isMaximized ? (
                <button
                  className="h-[30px] w-[30px] flex items-center hover:bg-neutral-700"
                  onClick={() => overwolf.windows.restore(currentWindow!.id)}
                >
                  <svg>
                    <use xlinkHref="#window-control_restore" />
                  </svg>
                </button>
              ) : (
                <button
                  className="h-[30px] w-[30px] flex items-center hover:bg-neutral-700"
                  onClick={() => maximizeWindow(currentWindow!.id)}
                >
                  <svg>
                    <use xlinkHref="#window-control_maximize" />
                  </svg>
                </button>
              )}
              <button
                className="h-[30px] w-[30px] flex items-center hover:bg-red-600"
                id="close"
                onClick={closeMainWindow}
              >
                <svg>
                  <use xlinkHref="#window-control_close" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <button
                className="flex items-center hover:bg-neutral-700 px-1"
                onClick={() => overwolf.windows.minimize(currentWindow!.id)}
              >
                <span className="text-xs font-mono truncate">Hide App</span>
              </button>
            </>
          )}
        </div>
      </header>
    </>
  );
}
