import { useDict } from "@/app/components/(i18n)/i18n-provider";
import { getMapFromCoords, modHousingCoords } from "@/app/lib/maps";
import type { NODE, spawnNodes } from "@/app/lib/nodes";
import {
  sendActorsToPaliaAPI,
  sendWeeklyWantsToPaliaAPI,
} from "@/app/lib/palia-api";
import { spawnGroups } from "@/app/lib/spawn-groups";
import type { GameActor } from "@/app/lib/storage/game-info";
import { useGameInfoStore } from "@/app/lib/storage/game-info";
import { useMapStore } from "@/app/lib/storage/map";
import { useParamsStore } from "@/app/lib/storage/params";
import { useSettingsStore } from "@/app/lib/storage/settings";
import { villagers } from "@/app/lib/villager";
import leaflet from "leaflet";
import { useEffect, useRef } from "react";
import PlayerMarker from "./player-marker";

export type Actor = {
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

export default function Player() {
  const { map, mapName } = useMapStore();
  const mounted = useRef(false);
  const gameInfo = useGameInfoStore();
  const followPlayerPosition = useSettingsStore(
    (state) => state.followPlayerPosition
  );
  const marker = useRef<PlayerMarker | null>(null);
  const villagerMarkers = useRef<{ [key: string]: PlayerMarker }>({});
  const setParams = useParamsStore((state) => state.setParams);
  const dict = useDict();

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    let lastMapName = "kilima-valley";

    overwolf.extensions.current.getExtraObject("palia", (result) => {
      if (!result.success) {
        console.error("failed to create object: ", result);
        return;
      }

      const plugin = result.object;
      console.log("Initialized plugin");
      let prevPosition = { x: 0, y: 0, z: 0, r: 0 };
      let lastError = "";
      let firstData = false;
      let lastPreferenceDataVersionNumber = 0;
      const getData = () => {
        plugin.Listen(
          (
            player: Actor,
            actors: Actor[],
            currentGiftPreferences: CurrentGiftPreferences
          ) => {
            if (!firstData) {
              firstData = true;
              console.log("Got first data", JSON.stringify(player));
              console.log(currentGiftPreferences);
            }
            if (lastError) {
              lastError = "";
            }
            if (
              player.x !== prevPosition.x ||
              player.y !== prevPosition.y ||
              player.z !== prevPosition.z ||
              player.r !== prevPosition.r
            ) {
              prevPosition = player;
              const mapName = getMapFromCoords(player);

              if (mapName) {
                const position =
                  mapName === "housing" ? modHousingCoords(player) : player;
                gameInfo.setPlayer({
                  className: player.className,
                  position: position,
                  rotation: player.r,
                  mapName: mapName,
                });
                if (mapName && mapName !== lastMapName) {
                  console.log(
                    `Entering new map: ${mapName} on ${player.x},${player.y}`
                  );
                  lastMapName = mapName;
                  setParams({
                    mapName,
                    dict,
                  });
                }
              }
            }
            const villagers: GameActor[] = [];
            const foundSpawnNodes: NODE[] = [];
            actors.forEach((actor) => {
              const className = actor.className.split(" ")[0];
              const type = className.replace("+", "");
              const isStar = className.includes("+");
              if (type.startsWith("BP_Villager")) {
                villagers.push({
                  className: actor.className,
                  position: {
                    x: actor.x,
                    y: actor.y,
                    z: actor.z,
                  },
                  rotation: 0,
                  mapName: getMapFromCoords(actor),
                });
              }
              if (
                Object.values(spawnGroups).some((group) =>
                  group.some((id) => type.startsWith(id))
                )
              ) {
                foundSpawnNodes.push({
                  type: type as keyof typeof spawnNodes,
                  id: type + "@" + actor.x + "," + actor.y,
                  x: actor.x,
                  y: actor.y,
                  z: actor.z,
                  mapName: getMapFromCoords(actor)!,
                  isSpawnNode: true,
                  isStar,
                });
              }
            });

            gameInfo.setVillagers(villagers);
            gameInfo.setSpawnNodes(foundSpawnNodes);

            if (
              lastPreferenceDataVersionNumber !==
              currentGiftPreferences.preferenceDataVersionNumber
            ) {
              gameInfo.setCurrentGiftPreferences(currentGiftPreferences);
              lastPreferenceDataVersionNumber =
                currentGiftPreferences.preferenceDataVersionNumber;
              sendWeeklyWantsToPaliaAPI(currentGiftPreferences);
            }
            sendActorsToPaliaAPI(actors);

            setTimeout(getData, 100);
          },
          (err: string) => {
            if (err !== lastError) {
              lastError = err;
              firstData = false;
              console.error("Error: ", err);
            }
            setTimeout(getData, 1000);
          }
        );
      };
      setTimeout(getData, 100);
    });
  }, []);

  useEffect(() => {
    if (!map || mapName !== gameInfo.player?.mapName) {
      return;
    }
    if (!marker.current) {
      const icon = leaflet.icon({
        iconUrl: "/icons/Icon_PlayerMarker.png",
        className: "player",
        iconSize: [36, 36],
      });
      marker.current = new PlayerMarker(
        [gameInfo.player.position.y, gameInfo.player.position.x],
        {
          icon,
          interactive: false,
        }
      );
      marker.current.rotation = gameInfo.player.rotation;
    } else {
      marker.current.updatePosition(gameInfo.player);
    }
    marker.current.addTo(map);

    return () => {
      marker.current?.remove();
      marker.current = null;
    };
  }, [map, mapName, gameInfo.player?.mapName]);

  useEffect(() => {
    if (!map) {
      return;
    }
    try {
      gameInfo.villagers.forEach((villager) => {
        if (!villagerMarkers.current[villager.className]) {
          const villagerClassName = villager.className.split(" ")[0];
          const details = Object.values(villagers).find(
            (v) => "className" in v && v.className === villagerClassName
          );
          const villagerIconUrl = details?.icon;
          if (!villagerIconUrl) {
            console.warn(`Unknown villager: ${villagerClassName}`);
          }
          const icon = leaflet.icon({
            iconUrl: villagerIconUrl ?? "/icons/WT_Backer_Map_Marker_Green.png",
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
            details?.name ?? villager.className
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
        if (!gameInfo.villagers.some((v) => v.className === key)) {
          villagerMarkers.current[key].remove();
        }
      });
    } catch (err) {
      // ignore
    }
  }, [gameInfo.villagers]);

  const lastAnimation = useRef(0);

  useEffect(() => {
    if (
      !map ||
      !gameInfo.player ||
      !marker.current ||
      mapName !== gameInfo.player?.mapName
    ) {
      return;
    }

    marker.current.updatePosition(gameInfo.player);

    if (followPlayerPosition) {
      const now = Date.now();
      if (now - lastAnimation.current > 500) {
        lastAnimation.current = now;
        document.querySelector(".leaflet-map-pane")?.classList.add("animate");
        map.panTo([gameInfo.player.position.y, gameInfo.player.position.x], {
          animate: false,
          duration: 0,
          easeLinearity: 1,
          noMoveStart: true,
        });
      }
    }
  }, [gameInfo.player, followPlayerPosition]);

  useEffect(() => {
    if (!map) {
      return;
    }

    gameInfo.villagers.forEach((villager) => {
      if (mapName !== villager.mapName) {
        return;
      }
      villagerMarkers.current[villager.className]?.updatePosition(villager);
    });
  }, [gameInfo.villagers]);

  return <></>;
}
