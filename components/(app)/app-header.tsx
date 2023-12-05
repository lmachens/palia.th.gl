"use client";
import { useDict, useI18N } from "@/components/(i18n)/i18n-provider";
import WeeklyWants from "@/components/(weekly-wants)/weekly-wants";
import AppSettings from "@/components/app-settings";
import Brand from "@/components/brand";
import Channels from "@/components/channels";
import DiscordCTA from "@/components/discord-cta";
import GlobalMenu from "@/components/global-menu";
import HeaderToggle from "@/components/header-toggle";
import SVGIcons from "@/components/svg-icons";
import { Button } from "@/components/ui/button";
import { API_BASE_URI } from "@/lib/env";
import { useGameInfoStore } from "@/lib/storage/game-info";
import { useSettingsStore } from "@/lib/storage/settings";
import { cn } from "@/lib/utils";
import type { WEEKLY_WANTS } from "@/lib/weekly-wants";
import {
  closeMainWindow,
  maximizeWindow,
  setInputPassThrough,
  togglePreferedWindow,
  useCurrentWindow,
} from "@/lib/windows";
import { EyeNoneIcon } from "@radix-ui/react-icons";
import { useEffect, useLayoutEffect } from "react";
import useSWR from "swr";
import LocaleSelect from "../locale-select";
import UnlockButton from "./unlock-button";

async function getWeeklyWants(locale: string) {
  const response = await fetch(
    `${API_BASE_URI}/api/weekly-wants?locale=${locale}`
  );
  const data = (await response.json()) as WEEKLY_WANTS;
  return data;
}

export default function AppHeader() {
  const dict = useDict();
  const currentWindow = useCurrentWindow();
  const settingsStore = useSettingsStore();

  const isMaximized = currentWindow?.stateEx === "maximized";
  const isOverlay = useGameInfoStore((state) => state.isOverlay);
  const { locale } = useI18N();

  const { data } = useSWR(
    "/api/events/recent",
    () => getWeeklyWants(locale),
    {}
  );

  useEffect(() => {
    if (isOverlay) {
      setInputPassThrough(settingsStore.lockedWindow);
    }
  }, [settingsStore.lockedWindow]);

  useLayoutEffect(() => {
    if (isOverlay && currentWindow?.stateEx === "normal") {
      maximizeWindow(currentWindow.id);
    }
  }, [currentWindow]);

  if (isOverlay && settingsStore.lockedWindow) {
    return <UnlockButton onClick={settingsStore.toggleLockedWindow} />;
  }
  return (
    <>
      <SVGIcons />
      <header
        className={cn(
          "h-[50px] z-[9990] fixed left-0 right-0 top-0 border-b bg-gradient-to-b  backdrop-blur-2xl border-neutral-800 bg-zinc-800/30 flex"
        )}
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
        <nav
          className={cn(
            `py-2 px-2 mx-auto flex items-center gap-2 text-sm font-bold grow overflow-auto`
          )}
        >
          <GlobalMenu
            dict={dict}
            afterPatreon={<Channels />}
            beforeSettings={<AppSettings />}
          />
          <Brand />
          <HeaderToggle
            label="Live Mode"
            checked={settingsStore.liveMode}
            onChange={(checked) => {
              settingsStore.setLiveMode(checked);
            }}
          />
          <HeaderToggle
            label="2nd Screen Mode"
            checked={!settingsStore.overlayMode}
            onChange={(checked) => {
              settingsStore.setOverlayMode(!checked);
              togglePreferedWindow();
            }}
          />
          <div className="grow" />
          {isOverlay && (
            <Button onClick={settingsStore.toggleLockedWindow}>
              <EyeNoneIcon />
              <span className="ml-1 hidden lg:block">Hide Menu</span>
            </Button>
          )}
          <WeeklyWants data={data && !("error" in data) ? data : undefined} />
          <DiscordCTA />
          <LocaleSelect />
        </nav>
        <div className={cn("pb-5")}>
          <button
            className="h-full w-[32px] inline-flex hover:bg-neutral-700"
            onClick={() => overwolf.windows.minimize(currentWindow!.id)}
          >
            <svg className="h-full">
              <use xlinkHref="#window-control_minimize" />
            </svg>
          </button>
          {isOverlay ? null : isMaximized ? (
            <button
              className="h-full w-[32px] inline-flex hover:bg-neutral-700"
              onClick={() => overwolf.windows.restore(currentWindow!.id)}
            >
              <svg className="h-full">
                <use xlinkHref="#window-control_restore" />
              </svg>
            </button>
          ) : (
            <button
              className="h-full w-[32px] inline-flex hover:bg-neutral-700"
              onClick={() => maximizeWindow(currentWindow!.id)}
            >
              <svg className="h-full">
                <use xlinkHref="#window-control_maximize" />
              </svg>
            </button>
          )}
          <button
            className="h-full w-[32px] inline-flex hover:bg-red-600"
            id="close"
            onClick={closeMainWindow}
          >
            <svg className="h-full">
              <use xlinkHref="#window-control_close" />
            </svg>
          </button>
        </div>
      </header>
    </>
  );
}
