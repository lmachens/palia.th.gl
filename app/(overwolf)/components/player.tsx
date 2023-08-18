import { transformation, useMap } from "@/app/components/(map)/map";
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
      iconUrl: "/icons/player.webp",
      className: "player",
      iconSize: [36, 36],
    });
    marker.current = new PlayerMarker([0, 0], {
      icon,
      interactive: false,
    });
    marker.current.rotation = 0;
    marker.current.addTo(map);

    let lastPosition = { x: 0, y: 0, z: 0 };
    const parseLine = (line: string) => {
      try {
        const matched = line.match(/location (.* })/);
        if (matched?.length === 2) {
          const jsonString = matched[1]
            .replaceAll(/ ([\w]+):/g, ', "$1":')
            .replace("{,", "{");
          const { map_name: map, x, y, z } = JSON.parse(jsonString);

          const position = { x, y, z };
          const rotation =
            (Math.atan2(
              position.y - (lastPosition.y || position.y),
              position.x - (lastPosition.x || position.x)
            ) *
              180) /
            Math.PI;
          lastPosition = position;
          gameInfo.setPlayer({
            position,
            rotation,
            map,
          });
        }
      } catch (err) {
        //
      }
    };

    const filePath =
      overwolf.io.paths.localAppData + "/Palia/Saved/Logs/Palia.log";
    overwolf.io.readFileContents(
      filePath,
      "UTF8" as overwolf.io.enums.eEncoding.UTF8,
      (result) => {
        console.log(result);
        if (result.content) {
          const lines = result.content.split("\n").reverse();
          const found = lines.find((line) => line.includes("location"));
          if (found) {
            parseLine(found);
          }
        }
      }
    );
    overwolf.io.listenOnFile(
      "Palia.log",
      filePath,
      { skipToEnd: true },
      (result) => {
        if (result.content) {
          parseLine(result.content);
        }
      }
    );
  }, []);

  useEffect(() => {
    if (!gameInfo.player || !marker.current) {
      return;
    }

    marker.current.updatePosition({
      ...gameInfo.player,
      position: {
        ...gameInfo.player.position,
        x: gameInfo.player.position.x / transformation[0],
        y: gameInfo.player.position.y / transformation[1],
      },
    });
    console.log(gameInfo.player);
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
