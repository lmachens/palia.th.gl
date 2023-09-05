import { useMap } from "@/app/components/(map)/map";
import { useGameInfoStore } from "@/app/lib/storage/game-info";
import { useSettingsStore } from "@/app/lib/storage/settings";
import leaflet from "leaflet";
import { useEffect, useRef } from "react";
import PlayerMarker from "./player-marker";

export default function Player() {
  const map = useMap();
  const mounted = useRef(false);
  const gameInfo = useGameInfoStore();
  const followPlayerPosition = useSettingsStore(
    (state) => state.followPlayerPosition
  );
  const marker = useRef<PlayerMarker | null>(null);

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
    marker.current.addTo(map);

    overwolf.extensions.current.getExtraObject("palia", (result) => {
      if (!result.success) {
        console.error("failed to create object: ", result);
        return;
      }

      const plugin = result.object;
      console.log("Initialized plugin");

      let prevPosition = { X: 0, Y: 0, Z: 0, R: 0 };
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
              console.log(data);
              gameInfo.setPlayer({
                position: {
                  x: data.X,
                  y: data.Y,
                  z: data.Z,
                },
                rotation: data.R,
                map: "kilima-valley",
              });
            }
            setTimeout(getData, 100);
          }
        );
      };
      setTimeout(getData, 100);
    });
  }, []);

  useEffect(() => {
    if (!gameInfo.player || !marker.current) {
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
