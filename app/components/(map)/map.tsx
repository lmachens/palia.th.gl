"use client";
import { useOverwolfRouter } from "@/app/(overwolf)/components/overwolf-router";
import { HOTKEYS } from "@/app/(overwolf)/lib/config";
import leaflet, { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { isDevelopment } from "@/app/lib/env";
import { CONFIGS } from "@/app/lib/maps";
import { useMapStore } from "@/app/lib/storage/map";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { useDict } from "../(i18n)/i18n-provider";

leaflet.PM.setOptIn(true);

export const MAX_BOUNDS: LatLngBoundsExpression = [
  [0, 0],
  [-512, 512],
];

export default function Map({
  children,
  map: mapName,
}: {
  children?: React.ReactNode;
  map: string;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [leafletMap, setLeafletMap] = useState<leaflet.Map | null>(null);

  const setMap = useMapStore((state) => state.setMap);
  const overwolfRouter = useOverwolfRouter();
  const router = useRouter();
  const params = useParams()!;
  const dict = useDict();

  useEffect(() => {
    const config = CONFIGS[mapName as keyof typeof CONFIGS];
    const worldCRS = leaflet.extend({}, leaflet.CRS.Simple, {
      transformation: new leaflet.Transformation(
        config.transformation[0],
        config.transformation[1],
        config.transformation[2],
        config.transformation[3]
      ),
    });

    const map = leaflet.map(mapRef.current!, {
      zoomControl: false,
      attributionControl: false,
      minZoom: -2,
      maxZoom: 5,
      zoomSnap: 0,
      zoomDelta: 0.4,
      wheelPxPerZoomLevel: 120,
      crs: worldCRS,
      renderer: leaflet.canvas(),
      pmIgnore: false,
    });

    const paramsCoordinates = overwolfRouter
      ? overwolfRouter.value.coordinates
      : params.coordinates;
    const coordinates = (
      paramsCoordinates && decodeURIComponent(paramsCoordinates as string)
    )
      ?.replace("@", "")
      .split(",")
      .map(Number);
    if (coordinates?.length === 2) {
      map.setView([coordinates[1], coordinates[0]], 2);
    } else {
      map.fitBounds(config.bounds, {
        padding: [
          -Math.floor(window.innerWidth / 6),
          -Math.floor(window.innerHeight / 6),
        ],
      });
    }

    setLeafletMap(map);

    map.on("click", (event) => {
      if (
        // @ts-ignore
        event.originalEvent.target.className !== "leaflet-zoom-animated"
      ) {
        return;
      }
      if (overwolfRouter) {
        overwolfRouter.update({ name: "", coordinates: "" });
        return;
      }
      if (
        location.pathname.startsWith("/embed") ||
        location.pathname.split("/").length < 4 // No node selected
      ) {
        return;
      }
      {
        router.replace(
          `/${params.lang}/${encodeURIComponent(dict.maps[mapName])}${
            location.search
          }`
        );
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

    if (isDevelopment) {
      const divElement = leaflet.DomUtil.create("div", "leaflet-position");
      const handleMouseMove = (event: leaflet.LeafletMouseEvent) => {
        divElement.innerHTML = `<span>[${event.latlng.lng.toFixed(
          2
        )}, ${event.latlng.lat.toFixed(2)}]</span>`;
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

      const coordinates = new CoordinatesControl({ position: "bottomright" });

      coordinates.addTo(map);
    }

    return () => {
      setLeafletMap(null);
      map.off();
      map.remove();
    };
  }, [mapName]);

  useEffect(() => {
    setMap(leafletMap, mapName);
  }, [leafletMap]);

  return (
    <>
      <div
        ref={mapRef}
        className={`map h-full !bg-inherit relative outline-none`}
      />
      {leafletMap && children}
    </>
  );
}
