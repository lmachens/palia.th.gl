"use client";
import { CONFIGS } from "@/lib/maps";
import { useGameInfoStore } from "@/lib/storage/game-info";
import { useMap } from "@/lib/storage/map";
import { useParamsStore } from "@/lib/storage/params";
import { useSettingsStore } from "@/lib/storage/settings";
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
    try {
      const canvasLayer = createCanvasLayer(
        `/maps/${mapName}/{z}/{y}/{x}.webp`,
        {
          minNativeZoom: config.minNativeZoom,
          maxNativeZoom: config.maxNativeZoom,
          minZoom: map.getMinZoom(),
          maxZoom: map.getMaxZoom(),
          bounds: config.bounds,
          tileSize: 512,
          filter: isOverlay ? mapFilter : "none",
        }
      ).addTo(map);
      return () => {
        canvasLayer.removeFrom(map);
      };
    } catch (e) {
      //
    }
  }, [mapFilter, map]);

  return <></>;
}
