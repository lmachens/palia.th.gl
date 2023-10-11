import { useGameInfoStore } from "@/app/lib/storage/game-info";
import { useMap } from "@/app/lib/storage/map";
import { useSettingsStore } from "@/app/lib/storage/settings";
import leaflet from "leaflet";
import { useEffect, useRef } from "react";
// import {
//   GameSession,
//   addTraceLineItem,
//   getLatestGameSession,
// } from "../lib/game-sessions";

function createCircle(position: { x: number; y: number; z: number }) {
  return leaflet.circle([position.y, position.x] as [number, number], {
    radius: 0,
    interactive: false,
    color: "#8a8374",
  });
}

export default function TraceLine() {
  const map = useMap();
  const player = useGameInfoStore((state) => state.player);
  const lastPosition = useRef<{ x: number; y: number; z: number }>({
    x: 0,
    y: 0,
    z: 0,
  });
  const layerGroup = useRef<leaflet.LayerGroup>();
  if (!layerGroup.current) {
    layerGroup.current = new leaflet.LayerGroup();
  }
  const settingsStore = useSettingsStore();

  useEffect(() => {
    if (!settingsStore.showTraceLine || !map) {
      return;
    }
    const targetLayerGroup = layerGroup.current!;

    targetLayerGroup.addTo(map);

    return () => {
      targetLayerGroup.removeFrom(map);
    };
  }, [settingsStore.showTraceLine, map]);

  useEffect(() => {
    if (!player?.position) {
      return;
    }
    const targetLayerGroup = layerGroup.current!;
    if (
      Math.abs(player.position.x - lastPosition.current.x) > 0.05 ||
      Math.abs(player.position.y - lastPosition.current.y) > 0.05
    ) {
      const circle = createCircle(player.position);
      circle.addTo(targetLayerGroup);
      lastPosition.current = player.position;
      // addTraceLineItem(player.position);
    }
  }, [player?.position]);

  return <></>;
}
