"use client";
import { CONFIGS } from "@/app/lib/maps";
import { useGameInfoStore } from "@/app/lib/storage/game-info";
import { useMap } from "@/app/lib/storage/map";
import { useParamsStore } from "@/app/lib/storage/params";
import { useSettingsStore } from "@/app/lib/storage/settings";
import { useEffect } from "react";
import { createCanvasLayer } from "./canvas-layer";

export default function Tiles() {
  const map = useMap();
  const mapFilter = useSettingsStore((state) => state.mapFilter);
  const isOverlay = useGameInfoStore((state) => state.isOverlay);
  const mapName = useParamsStore((state) => state.mapName);

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
