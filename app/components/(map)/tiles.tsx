"use client";
import { useGameInfoStore } from "@/app/lib/storage/game-info";
import { useSettingsStore } from "@/app/lib/storage/settings";
import { LatLngBoundsExpression } from "leaflet";
import { useEffect } from "react";
import { createCanvasLayer } from "./canvas-layer";
import { useMap } from "./map";

export const MIN_NATIVE_ZOOM = 0;
export const MAX_NATIVE_ZOOM = 2;
export const TILE_SIZE = 512;
export const BOUNDS: LatLngBoundsExpression = [
  [0, 0],
  [-TILE_SIZE, TILE_SIZE],
];

export default function Tiles() {
  const map = useMap();
  const mapFilter = useSettingsStore((state) => state.mapFilter);
  const isOverlay = useGameInfoStore((state) => state.isOverlay);

  useEffect(() => {
    if (isOverlay && mapFilter === "full") {
      return;
    }
    const canvasLayer = createCanvasLayer(
      "/maps/kilima-valley/{z}/{y}/{x}.jpg",
      {
        minNativeZoom: MIN_NATIVE_ZOOM,
        maxNativeZoom: MAX_NATIVE_ZOOM,
        minZoom: map.getMinZoom(),
        maxZoom: map.getMaxZoom(),
        // bounds: BOUNDS,
        tileSize: TILE_SIZE,
        updateInterval: 100,
        keepBuffer: 8,
        // zoomOffset: 2,
        filter: isOverlay ? mapFilter : "none",
      }
    ).addTo(map);

    return () => {
      canvasLayer.remove();
    };
  }, [mapFilter, map]);

  return <></>;
}
