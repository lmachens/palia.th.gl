import { VILLAGER_ICONS } from "@/lib/icons";
import { useGameInfoStore } from "@/lib/storage/game-info";
import { useMapStore } from "@/lib/storage/map";
import { useParamsStore } from "@/lib/storage/params";
import leaflet from "leaflet";
import { useEffect, useRef } from "react";
import PlayerMarker from "./player-marker";

export type Actor = {
  address: number;
  className: string;
  x: number;
  y: number;
  z: number;
  r: number;
};

export type CurrentGiftPreferences = {
  preferenceResetTime: {
    dayOfWeek: number;
    hour: number;
    minute: number;
  };
  preferenceDataVersionNumber: number;
  currentPreferenceData: Array<{
    villagerCoreId: number;
    currentGiftPreferences: Array<number>;
  }>;
};

export default function Villagers() {
  const { map, mapName } = useMapStore();
  const liveVillagers = useGameInfoStore((state) => state.villagers);
  const villagerMarkers = useRef<{ [key: string]: PlayerMarker }>({});
  const filters = useParamsStore((state) => state.filters);
  const isVisible = filters.includes("villager");

  useEffect(() => {
    if (!map) {
      return;
    }
    if (!isVisible) {
      Object.keys(villagerMarkers.current).forEach((key) => {
        villagerMarkers.current[key].remove();
        delete villagerMarkers.current[key];
      });
      return;
    }
    try {
      liveVillagers.forEach((villager) => {
        if (!villagerMarkers.current[villager.className]) {
          const villagerClassName = villager.className.split(" ")[0];
          const iconDetails = VILLAGER_ICONS[villagerClassName];
          const icon = leaflet.icon({
            iconUrl: iconDetails.src ?? "/icons/T_Compass_Villager.png",
            className: "villager",
            iconSize: [24, 24],
          });
          villagerMarkers.current[villager.className] = new PlayerMarker(
            [villager.position.y, villager.position.x],
            {
              icon,
            }
          );
          villagerMarkers.current[villager.className].bindTooltip(
            iconDetails?.name ?? villager.className
          );
          villagerMarkers.current[villager.className].rotation =
            villager.rotation;
        } else {
          villagerMarkers.current[villager.className].updatePosition(
            villager,
            true
          );
        }
        villagerMarkers.current[villager.className].addTo(map);
      });
      Object.keys(villagerMarkers.current).forEach((key) => {
        if (!liveVillagers.some((v) => v.className === key)) {
          villagerMarkers.current[key].remove();
        }
      });
    } catch (err) {
      // ignore
    }
  }, [isVisible, liveVillagers]);

  useEffect(() => {
    if (!map || !isVisible) {
      return;
    }

    liveVillagers.forEach((villager) => {
      if (mapName !== villager.mapName) {
        return;
      }
      villagerMarkers.current[villager.className]?.updatePosition(villager);
    });
  }, [isVisible, liveVillagers]);

  return <></>;
}
