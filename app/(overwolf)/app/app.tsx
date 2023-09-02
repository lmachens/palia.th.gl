"use client";
import { I18NProvider } from "@/app/components/(i18n)/i18n-provider";
import ActiveRoutes from "@/app/components/(map)/active-routes";
import Map from "@/app/components/(map)/map";
import Nodes from "@/app/components/(map)/nodes";
import Tiles from "@/app/components/(map)/tiles";
import Menu from "@/app/components/menu";
import Search from "@/app/components/search";
import SearchParams from "@/app/components/search-params";
import { DEFAULT_LOCALE, LOCALES, loadDictionary } from "@/app/lib/i18n";
import { useGameInfoStore } from "@/app/lib/storage/game-info";
import { useSettingsStore } from "@/app/lib/storage/settings";
import { useEffect, useState } from "react";
import Ads from "../components/ads";
import AppContainer from "../components/app-container";
import Header from "../components/header";
import MapContainer from "../components/map-container";
import Player from "../components/player";
import ResizeBorders from "../components/resize-borders";
import TraceLine from "../components/trace-line";
import { WINDOWS } from "../lib/config";
import { waitForOverwolf } from "../lib/overwolf";
import { getCurrentWindow } from "../lib/windows";

export default function App() {
  const [ready, setReady] = useState(false);
  const locale = useSettingsStore((state) => state.locale);
  const dict = loadDictionary(locale);
  const setIsOverlay = useGameInfoStore((state) => state.setIsOverlay);
  const mapName = "kilima-valley";
  useEffect(() => {
    waitForOverwolf().then(() => {
      getCurrentWindow().then((currentWindow) => {
        setIsOverlay(currentWindow.name === WINDOWS.OVERLAY);
        setReady(true);
      });
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
      <AppContainer>
        <Header />
        <MapContainer>
          <Map map={mapName}>
            <Tiles map={mapName} />
            <Nodes map={mapName} />
            <ActiveRoutes />

            <Player />
            <TraceLine />
          </Map>
        </MapContainer>
        <Search />
        <Menu />
        <SearchParams />
      </AppContainer>
      <ResizeBorders />
      <Ads />
    </I18NProvider>
  );
}
