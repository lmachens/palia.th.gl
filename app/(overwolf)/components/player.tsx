import { useMapStore } from "@/app/components/(map)/map";
import { getMapFromCoords } from "@/app/lib/maps";
import { useGameInfoStore } from "@/app/lib/storage/game-info";
import { useSettingsStore } from "@/app/lib/storage/settings";
import leaflet from "leaflet";
import { useEffect, useRef } from "react";
import { useOverwolfRouter } from "./overwolf-router";
import PlayerMarker from "./player-marker";

export default function Player() {
  const { map, mapName } = useMapStore();
  const mounted = useRef(false);
  const gameInfo = useGameInfoStore();
  const followPlayerPosition = useSettingsStore(
    (state) => state.followPlayerPosition
  );
  const marker = useRef<PlayerMarker | null>(null);
  const router = useOverwolfRouter();

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const icon = leaflet.icon({
      iconUrl: "/icons/Icon_PlayerMarker.png",
      className: "player",
      iconSize: [36, 36],
    });
    marker.current = new PlayerMarker([0, 0], {
      icon,
      interactive: false,
    });
    marker.current.rotation = 0;

    let lastMapName = "kilima-valley";

    overwolf.extensions.current.getExtraObject("palia", (result) => {
      if (!result.success) {
        console.error("failed to create object: ", result);
        return;
      }

      const plugin = result.object;
      console.log("Initialized plugin");

      let prevPosition = { X: 0, Y: 0, Z: 0, R: 0 };
      let lastError = "";
      const getData = () => {
        plugin.Listen(
          (data: { X: number; Y: number; Z: number; R: number }) => {
            if (
              data.X !== prevPosition.X ||
              data.Y !== prevPosition.Y ||
              data.Z !== prevPosition.Z ||
              data.R !== prevPosition.R
            ) {
              prevPosition = data;
              const mapName = getMapFromCoords({
                x: data.X,
                y: data.Y,
              });

              if (mapName) {
                gameInfo.setPlayer({
                  position: {
                    x: data.X,
                    y: data.Y,
                    z: data.Z,
                  },
                  rotation: data.R,
                  mapName: mapName,
                });
                if (mapName && mapName !== lastMapName && "value" in router) {
                  lastMapName = mapName;
                  router.update({
                    mapName,
                  });
                }
              }
            }

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
    if (!map || !marker.current || mapName !== gameInfo.player?.mapName) {
      return;
    }
    marker.current.addTo(map);

    return () => {
      marker.current?.remove();
    };
  }, [map, gameInfo.player?.mapName]);

  useEffect(() => {
    if (!map || !gameInfo.player || !marker.current) {
      return;
    }

    marker.current.updatePosition(gameInfo.player);
    if (followPlayerPosition) {
      map.panTo(marker.current.getLatLng(), {
        duration: 1,
        easeLinearity: 1,
        noMoveStart: true,
      });
    }
  }, [gameInfo.player, followPlayerPosition]);

  return <></>;
}
