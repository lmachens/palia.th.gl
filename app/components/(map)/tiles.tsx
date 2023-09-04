"use client";
import { BOUNDS } from "@/app/lib/maps";
import { useGameInfoStore } from "@/app/lib/storage/game-info";
import { useSettingsStore } from "@/app/lib/storage/settings";
import { useEffect } from "react";
import { createCanvasLayer } from "./canvas-layer";
import { useMap } from "./map";

export const MIN_NATIVE_ZOOM = 0;
export const MAX_NATIVE_ZOOM = 3;
export const TILE_SIZE = 512;

export default function Tiles({ map: mapName }: { map: string }) {
  const map = useMap();
  const mapFilter = useSettingsStore((state) => state.mapFilter);
  const isOverlay = useGameInfoStore((state) => state.isOverlay);

  useEffect(() => {
    if (isOverlay && mapFilter === "full") {
      return;
    }
    const canvasLayer = createCanvasLayer(`/maps/${mapName}/{z}/{y}/{x}.webp`, {
      minNativeZoom: MIN_NATIVE_ZOOM,
      maxNativeZoom: MAX_NATIVE_ZOOM,
      minZoom: map.getMinZoom(),
      maxZoom: map.getMaxZoom(),
      bounds: BOUNDS[mapName as keyof typeof BOUNDS],
      tileSize: TILE_SIZE,
      updateInterval: 100,
      keepBuffer: 8,
      // zoomOffset: 2,
      filter: isOverlay ? mapFilter : "none",
    }).addTo(map);

    return () => {
      canvasLayer.remove();
    };
  }, [mapFilter, map]);

  return <></>;
}
