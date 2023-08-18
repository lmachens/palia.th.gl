"use client";
import { useOverwolfRouter } from "@/app/(overwolf)/components/overwolf-router";
import { HOTKEYS } from "@/app/(overwolf)/lib/config";
import leaflet, { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { create } from "zustand";

import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

leaflet.PM.setOptIn(true);

export const useMapStore = create<{
  map: leaflet.Map | null;
  setMap: (map: leaflet.Map | null) => void;
}>((set) => ({
  map: null,
  setMap: (map) => set({ map }),
}));

export const MAX_BOUNDS: LatLngBoundsExpression = [
  [194, -194],
  [-388, 388],
];

export function useMap() {
  const map = useMapStore((store) => store.map)!;
  return map;
}

export const transformation = [26772, -2230];

export default function Map({ children }: { children?: React.ReactNode }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { map, setMap } = useMapStore();
  const router = useOverwolfRouter();
  const params = useParams()!;

  useEffect(() => {
    const worldCRS = leaflet.extend({}, leaflet.CRS.Simple, {
      // transformation: new leaflet.Transformation(1, 0, 1, 0),
    });

    const map = leaflet.map(mapRef.current!, {
      zoomControl: false,
      attributionControl: false,
      minZoom: 5,
      maxZoom: 13,
      zoomSnap: 0,
      zoomDelta: 0.4,
      wheelPxPerZoomLevel: 120,
      crs: worldCRS,
      renderer: leaflet.canvas(),
      pmIgnore: false,
    });

    const isOverwolf = "value" in router;
    const paramsCoordinates = isOverwolf
      ? router.value.coordinates
      : params.coordinates;
    const coordinates = (
      paramsCoordinates && decodeURIComponent(paramsCoordinates as string)
    )
      ?.replace("@", "")
      .split(",")
      .map(Number);
    if (coordinates) {
      map.setView(coordinates as [number, number], 3);
    } else {
      map.setView([-0.5, 0.5], 10);
    }

    setMap(map);

    map.on("click", (event) => {
      if (
        // @ts-ignore
        event.originalEvent.target.className !== "leaflet-zoom-animated" ||
        location.pathname.startsWith("/embed")
      ) {
        return;
      }
      if ("update" in router) {
        router.update({ name: "", coordinates: "" });
      } else {
        router.replace(`/${params.lang ?? ""}${location.search}`);
      }
    });

    map.on("contextmenu", () => {
      // Do nothing
    });

    if (typeof overwolf !== "undefined") {
      overwolf.settings.hotkeys.onPressed.addListener((event) => {
        if (event.name === HOTKEYS.ZOOM_IN_APP) {
          map.zoomIn();
        } else if (event.name === HOTKEYS.ZOOM_OUT_APP) {
          map.zoomOut();
        }
      });
    }

    const divElement = leaflet.DomUtil.create("div", "leaflet-position");
    const handleMouseMove = (event: leaflet.LeafletMouseEvent) => {
      divElement.innerHTML = `<span>[${event.latlng.lng * transformation[0]}, ${
        event.latlng.lat * transformation[1]
      }]</span> <span>[${event.latlng.lng}, ${event.latlng.lat}]</span>`;
    };
    const handleMouseOut = () => {
      divElement.innerHTML = ``;
    };
    const CoordinatesControl = leaflet.Control.extend({
      onAdd(map: leaflet.Map) {
        map.on("mousemove", handleMouseMove);
        map.on("mouseout", handleMouseOut);
        return divElement;
      },
      onRemove(map: leaflet.Map) {
        map.off("mousemove", handleMouseMove);
        map.off("mouseout", handleMouseOut);
      },
    });
    const coordinatesControl = new CoordinatesControl({
      position: "topright",
    });

    coordinatesControl.addTo(map);

    return () => {
      setMap(null);
      // map.remove();
    };
  }, []);

  return (
    <>
      <div
        ref={mapRef}
        className={`map h-full !bg-inherit relative outline-none`}
      />
      {map && children}
    </>
  );
}
