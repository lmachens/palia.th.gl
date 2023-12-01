"use client";
import { I18NProvider } from "@/components/(i18n)/i18n-provider";
import ActiveRoutes from "@/components/(map)/active-routes";
import Map from "@/components/(map)/map";
import Nodes from "@/components/(map)/nodes";
import Tiles from "@/components/(map)/tiles";
import Villagers from "@/components/(map)/villagers";
import WeeklyWants from "@/components/(weekly-wants)/weekly-wants";
import LocaleSelect from "@/components/locale-select";
import Menu from "@/components/menu";
import Search from "@/components/search";
import { WINDOWS } from "@/lib/config";
import { API_BASE_URI } from "@/lib/env";
import { DEFAULT_LOCALE, LOCALES, loadDictionary } from "@/lib/i18n";
import { useGameInfoStore } from "@/lib/storage/game-info";
import { ParamsProvider } from "@/lib/storage/params";
import { useSettingsStore } from "@/lib/storage/settings";
import type { WEEKLY_WANTS } from "@/lib/weekly-wants";
import { getCurrentWindow } from "@/lib/windows";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Ads from "../components/ads";
import AppContainer from "../components/app-container";
import AppSettings from "../components/app-settings";
import Channels from "../components/channels";
import Header from "../components/header";
import MapContainer from "../components/map-container";
import Player from "../components/player";
import ResizeBorders from "../components/resize-borders";
import TraceLine from "../components/trace-line";

async function getWeeklyWants(locale: string) {
  const response = await fetch(
    `${API_BASE_URI}/api/weekly-wants?locale=${locale}`
  );
  const data = (await response.json()) as WEEKLY_WANTS;
  return data;
}

export default function App() {
  const [ready, setReady] = useState(false);
  const locale = useSettingsStore((state) => state.locale);
  const dict = loadDictionary(locale);
  const setIsOverlay = useGameInfoStore((state) => state.setIsOverlay);
  const { data } = useSWR(
    "/api/events/recent",
    () => getWeeklyWants(locale),
    {}
  );

  useEffect(() => {
    getCurrentWindow().then((currentWindow) => {
      setIsOverlay(currentWindow.name === WINDOWS.OVERLAY);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return <></>;
  }

  return (
    <I18NProvider
      value={{
        dict,
        defaultLocale: DEFAULT_LOCALE,
        locale,
        locales: LOCALES,
      }}
    >
      <ParamsProvider>
        <AppContainer>
          <Header>
            <WeeklyWants data={data && !("error" in data) ? data : undefined} />
            <LocaleSelect />
          </Header>
          <MapContainer>
            <Map>
              <Tiles />
              <Nodes />
              <ActiveRoutes />
              <Player />
              <Villagers />
              <TraceLine />
            </Map>
          </MapContainer>
          <Search />
          <Menu afterPatreon={<Channels />} beforeSettings={<AppSettings />} />
        </AppContainer>
      </ParamsProvider>
      <ResizeBorders />
      <Ads />
    </I18NProvider>
  );
}
