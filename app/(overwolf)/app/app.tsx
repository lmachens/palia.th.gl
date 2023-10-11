"use client";
import { I18NProvider } from "@/app/components/(i18n)/i18n-provider";
import ActiveRoutes from "@/app/components/(map)/active-routes";
import Map from "@/app/components/(map)/map";
import Nodes from "@/app/components/(map)/nodes";
import Tiles from "@/app/components/(map)/tiles";
import Menu from "@/app/components/menu";
import Search from "@/app/components/search";
import SearchParams from "@/app/components/search-params";
import WeeklyWants from "@/app/components/weekly-wants";
import { API_BASE_URI } from "@/app/lib/env";
import { DEFAULT_LOCALE, LOCALES, loadDictionary } from "@/app/lib/i18n";
import { useGameInfoStore } from "@/app/lib/storage/game-info";
import { ParamsProvider } from "@/app/lib/storage/params";
import { useSettingsStore } from "@/app/lib/storage/settings";
import type { WEEKLY_WANTS } from "@/app/lib/weekly-wants";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Ads from "../components/ads";
import AppContainer from "../components/app-container";
import Header from "../components/header";
import MapContainer from "../components/map-container";
import Player from "../components/player";
import ResizeBorders from "../components/resize-borders";
import TraceLine from "../components/trace-line";
import { WINDOWS } from "../lib/config";
import { getCurrentWindow } from "../lib/windows";


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
          <Header />
          <MapContainer>
            <Map>
              <Tiles />
              <Nodes />
              <ActiveRoutes />
              <Player />
              <TraceLine />
            </Map>
          </MapContainer>
          <Search>
          <WeeklyWants data={data} />
            </Search>
          <Menu />
          <SearchParams />
        </AppContainer>
      </ParamsProvider>
      <ResizeBorders />
      <Ads />
    </I18NProvider>
  );
}
