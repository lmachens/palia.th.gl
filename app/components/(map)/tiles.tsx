"use client";
import { CONFIGS } from "@/app/lib/maps";
import { useGameInfoStore } from "@/app/lib/storage/game-info";
import { useSettingsStore } from "@/app/lib/storage/settings";
import { useEffect } from "react";
import { createCanvasLayer } from "./canvas-layer";
import { useMap } from "./map";

export default function Tiles({ map: mapName }: { map: string }) {
  const map = useMap();
  const mapFilter = useSettingsStore((state) => state.mapFilter);
  const isOverlay = useGameInfoStore((state) => state.isOverlay);

  useEffect(() => {
    if ((isOverlay && mapFilter === "full") || !map) {
      return;
    }
    const config = CONFIGS[mapName as keyof typeof CONFIGS];
    const canvasLayer = createCanvasLayer(`/maps/${mapName}/{z}/{y}/{x}.webp`, {
      minNativeZoom: config.minNativeZoom,
      maxNativeZoom: config.maxNativeZoom,
      minZoom: map.getMinZoom(),
      maxZoom: map.getMaxZoom(),
      bounds: config.bounds,
      tileSize: 512,
      updateInterval: 100,
      keepBuffer: 8,
      // zoomOffset: 2,
      filter: isOverlay ? mapFilter : "none",
    }).addTo(map);

    return () => {
      canvasLayer.removeFrom(map);
    };
  }, [mapFilter, map]);

  return <></>;
}
