import { useMapStore } from "@/app/components/(map)/map";
import { getMapFromCoords, modHousingCoords } from "@/app/lib/maps";
import { useGameInfoStore } from "@/app/lib/storage/game-info";
import { useSettingsStore } from "@/app/lib/storage/settings";
import { villagers } from "@/app/lib/villager";
import leaflet from "leaflet";
import { useEffect, useRef } from "react";
import { useOverwolfRouter } from "./overwolf-router";
import PlayerMarker from "./player-marker";

type Actor = {
  className: string;
  x: number;
  y: number;
  z: number;
  r: number;
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

  const overwolfRouter = useOverwolfRouter();

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
      const getData = () => {
        plugin.Listen(
          (player: Actor, actors: Actor[]) => {
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
                if (mapName && mapName !== lastMapName && overwolfRouter) {
                  console.log(
                    `Entering new map: ${mapName} on ${player.x},${player.y}`
                  );
                  lastMapName = mapName;
                  overwolfRouter.update({
                    mapName,
                  });
                }
              }
            }
            const villagers = actors
              .filter((actor) => actor.className.startsWith("BP_Villager"))
              .map((actor) => ({
                className: actor.className,
                position: {
                  x: actor.x,
                  y: actor.y,
                  z: actor.z,
                },
                rotation: 0,
                mapName: getMapFromCoords(actor),
              }));
            gameInfo.setVillagers(villagers);
            setTimeout(getData, 100);
          },
          (err: any) => {
            if (err instanceof Error && err.message !== lastError) {
              lastError = err.message;
              console.error("Error: ", err.message);
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
  }, [map, mapName, gameInfo.villagers]);

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
      map.panTo(marker.current.getLatLng(), {
        duration: 1,
        easeLinearity: 1,
      });
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
