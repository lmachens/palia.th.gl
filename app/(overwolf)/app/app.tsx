"use client";
import AppHeader from "@/components/(app)/app-header";
import DiscordRPC from "@/components/(app)/discord-rpc";
import { I18NProvider } from "@/components/(i18n)/i18n-provider";
import ActiveRoutes from "@/components/(map)/active-routes";
import Map from "@/components/(map)/map";
import Nodes from "@/components/(map)/nodes";
import Tiles from "@/components/(map)/tiles";
import Villagers from "@/components/(map)/villagers";
import Ads from "@/components/ads";
import MapContainer from "@/components/map-container";
import Player from "@/components/player";
import ResizeBorders from "@/components/resize-borders";
import Search from "@/components/search";
import TraceLine from "@/components/trace-line";
import { WINDOWS } from "@/lib/config";
import { DEFAULT_LOCALE, LOCALES, loadDictionary } from "@/lib/i18n";
import { useGameInfoStore } from "@/lib/storage/game-info";
import { ParamsProvider } from "@/lib/storage/params";
import { useSettingsStore } from "@/lib/storage/settings";
import { getCurrentWindow } from "@/lib/windows";
import { useEffect, useState } from "react";

export default function App() {
  const [ready, setReady] = useState(false);
  const locale = useSettingsStore((state) => state.locale);
  const dict = loadDictionary(locale);
  const setIsOverlay = useGameInfoStore((state) => state.setIsOverlay);

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
        <AppHeader />
        <MapContainer>
          <Map>
            <Tiles />
            <Nodes />
            <ActiveRoutes />
            <Player />
            <DiscordRPC />
            <Villagers />
            <TraceLine />
          </Map>
        </MapContainer>
        <Search />
      </ParamsProvider>
      <ResizeBorders />
      <Ads />
    </I18NProvider>
  );
}
