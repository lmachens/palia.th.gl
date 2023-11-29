import PlayerMarker from "@/app/components/(map)/player-marker";
import { colorizeImage } from "@/app/lib/images";
import { useGameInfoStore } from "@/app/lib/storage/game-info";
import { useMap, useMapStore } from "@/app/lib/storage/map";
import { useParamsStore } from "@/app/lib/storage/params";
import ColorHash from "color-hash";
import leaflet from "leaflet";
import { useEffect, useRef } from "react";
const colorHash = new ColorHash({ lightness: 0.75 });

export default function useOtherPlayers() {
  const map = useMap();
  const filters = useParamsStore((state) => state.filters);
  const isVisible = filters.includes("otherPlayer");
  const otherPlayers = useGameInfoStore((state) => state.otherPlayers);
  const otherPlayersMarkers = useRef<{ [key: string]: PlayerMarker }>({});
  const mapName = useMapStore((state) => state.mapName);

  useEffect(() => {
    if (!map) {
      return;
    }
    if (!isVisible) {
      Object.keys(otherPlayersMarkers.current).forEach((key) => {
        otherPlayersMarkers.current[key].remove();
        delete otherPlayersMarkers.current[key];
      });
      return;
    }
    try {
      otherPlayers.forEach(async (otherPlayer) => {
        if (!otherPlayersMarkers.current[otherPlayer.guid]) {
          const rgb = colorHash.rgb(otherPlayer.guid);
          const image = await colorizeImage(
            "/icons/Icon_PlayerMarker.png",
            rgb
          );

          const icon = leaflet.icon({
            iconUrl: image,
            className: "player",
            iconSize: [24, 24],
          });
          otherPlayersMarkers.current[otherPlayer.guid] = new PlayerMarker(
            [otherPlayer.position.y, otherPlayer.position.x],
            {
              icon,
            }
          );
          otherPlayersMarkers.current[otherPlayer.guid].bindTooltip(
            otherPlayer.name
          );
          otherPlayersMarkers.current[otherPlayer.guid].rotation =
            otherPlayer.rotation;
        } else {
          otherPlayersMarkers.current[otherPlayer.guid].updatePosition(
            otherPlayer
          );
        }
        otherPlayersMarkers.current[otherPlayer.guid].addTo(map);
      });
      Object.keys(otherPlayersMarkers.current).forEach((key) => {
        if (!otherPlayers.some((v) => v.guid === key)) {
          otherPlayersMarkers.current[key].remove();
        }
      });
    } catch (err) {
      // ignore
    }
  }, [isVisible, otherPlayers]);

  useEffect(() => {
    if (!map || !isVisible) {
      return;
    }

    otherPlayers.forEach((otherPlayer) => {
      if (mapName !== otherPlayer.mapName) {
        return;
      }
      otherPlayersMarkers.current[otherPlayer.guid]?.updatePosition(
        otherPlayer
      );
    });
  }, [isVisible, otherPlayers]);
}
