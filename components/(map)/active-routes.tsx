"use client";
import { useMap } from "@/lib/storage/map";
import { useRoutesStore } from "@/lib/storage/routes";
import leaflet from "leaflet";
import { useEffect } from "react";

export default function ActiveRoutes() {
  const map = useMap();

  const routes = useRoutesStore();

  useEffect(() => {
    if (routes.isCreating || typeof window === "undefined" || !map) {
      return;
    }
    const layers: leaflet.Layer[] = [];
    routes.activeRoutes.forEach((activeRoute) => {
      const route = routes.routes.find(({ id }) => id === activeRoute);
      if (!route) {
        return;
      }

      route.positions.forEach((layerPositions) => {
        if (layerPositions.length < 2) {
          return;
        }

        const layer = leaflet.polyline(
          layerPositions.map(({ position }) => position)
        );
        layers.push(layer);
        layer.addTo(map);
      });
      route.texts?.forEach((textPosition) => {
        const layer = leaflet.marker(textPosition.position, {
          textMarker: true,
          text: textPosition.text,
          interactive: false,
          pmIgnore: false,
        });
        layers.push(layer);
        layer.addTo(map);
      });
    });

    return () => {
      layers.forEach((layer) => {
        layer.remove();
      });
    };
  }, [routes.isCreating, routes.activeRoutes]);

  return <></>;
}
