"use client";
import { useGlobalSettingsStore } from "@/app/lib/storage/global-settings";
import { territories } from "@/app/lib/territories";
import leaflet from "leaflet";
import { useEffect } from "react";
import { useDict } from "../(i18n)/i18n-provider";
import { useMap } from "./map";

export default function Territories() {
  const map = useMap();
  const dict = useDict();
  const showTerritoryNames = useGlobalSettingsStore(
    (state) => state.showTerritoryNames
  );

  useEffect(() => {
    const featureGroup = leaflet.featureGroup(undefined);

    featureGroup.addTo(map);

    territories.forEach((territory) => {
      const polygons = leaflet.polygon(territory.points as any, {
        color: "rgb(200 200 200)",
        fill: false,
        weight: 1,
        interactive: true,
      });

      polygons.addTo(featureGroup);

      if (!showTerritoryNames) {
        return;
      }
      const textLabel = leaflet.marker(polygons.getCenter(), {
        icon: leaflet.divIcon({
          className: "text-white text-shadow !w-auto text-sm",
          html: `<div class="-translate-x-1/2 whitespace-nowrap">${
            dict.generated.territories[territory.id].name
          }${
            "levelMin" in territory &&
            "levelMax" in territory &&
            territory.levelMin !== territory.levelMax
              ? `<p class="text-center">${territory.levelMin}-${territory.levelMax}</p>`
              : ""
          }</div>`,
        }),
        pane: "overlayPane",
        interactive: false,
      });
      textLabel.addTo(featureGroup);
    });
    return () => {
      featureGroup.removeFrom(map);
      featureGroup.clearLayers();
    };
  }, [showTerritoryNames, dict]);

  return <></>;
}
