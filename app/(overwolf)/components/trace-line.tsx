import { useGameInfoStore } from "@/app/lib/storage/game-info";
import { useMap } from "@/app/lib/storage/map";
import { useSettingsStore } from "@/app/lib/storage/settings";
import leaflet from "leaflet";
import { useEffect, useRef } from "react";

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
  const traceDots = useRef<leaflet.Circle[]>();
  const layerGroup = useRef<leaflet.LayerGroup>();
  if (!traceDots.current) {
    traceDots.current = [];
  }
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

    const distance = Math.sqrt(
      Math.pow(player.position.x - lastPosition.current.x, 2) +
        Math.pow(player.position.y - lastPosition.current.y, 2)
    );
    if (distance > 200) {
      const traceDotsGroup = traceDots.current!;
      const targetLayerGroup = layerGroup.current!;
      lastPosition.current = player.position;
      const circle = createCircle(player.position);
      traceDotsGroup.push(circle);
      circle.addTo(targetLayerGroup);

      const layers = targetLayerGroup.getLayers();
      if (layers.length > settingsStore.traceLineLength) {
        layers[layers.length - 1 - settingsStore.traceLineLength]?.remove();
      }
    }
  }, [player?.position]);

  useEffect(() => {
    if (!map) {
      return;
    }
    const traceDotsGroup = traceDots.current!;
    const targetLayerGroup = layerGroup.current!;

    for (let i = 0; i < traceDotsGroup.length; i++) {
      const traceDot = traceDotsGroup[i];
      if (i < traceDotsGroup.length - settingsStore.traceLineLength) {
        if (targetLayerGroup.hasLayer(traceDot)) {
          targetLayerGroup.removeLayer(traceDot);
        }
      } else if (!targetLayerGroup.hasLayer(traceDot)) {
        traceDot.addTo(targetLayerGroup);
      }
    }
  }, [settingsStore.traceLineLength]);
  return <></>;
}
