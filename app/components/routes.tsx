"use client";
import { nodes } from "@/app/lib/nodes";

import { nanoid } from "nanoid";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { LatLng, Marker, Polyline } from "../lib/leaflet";
import { leaflet } from "../lib/leaflet";
import { useGlobalSettingsStore } from "../lib/storage/global-settings";
import { useMap } from "../lib/storage/map";
import type { ROUTE } from "../lib/storage/routes";
import { useRoutesStore } from "../lib/storage/routes";

const RoutesList = dynamic(() => import("./routes-list"), {
  ssr: false,
});

export default function Routes() {
  const map = useMap();
  const routes = useRoutesStore();
  const showRoutes = useGlobalSettingsStore((state) => state.showRoutes);

  const setRoutePolylines = useCallback((polylineLayers: Polyline[]) => {
    const types: ROUTE["types"] = [];
    const positions: ROUTE["positions"] = [];
    polylineLayers.forEach((polylineLayer) => {
      const latLngs = polylineLayer.getLatLngs() as LatLng[];
      if (latLngs.length === 0) {
        return;
      }
      const layerPositions = latLngs.map((latLng) => {
        return {
          position: [latLng.lat, latLng.lng] as [number, number],
        };
      });
      positions.push(layerPositions);
    });
    routes.updateTempRoute({
      types,
      positions,
    });
  }, []);

  const setRouteTexts = useCallback((textLayers: Marker[]) => {
    const texts: ROUTE["texts"] = [];
    textLayers.forEach((textLayer) => {
      const latLngs = textLayer.getLatLng();
      texts.push({
        position: [latLngs.lat, latLngs.lng] as [number, number],
        text: textLayer.pm.getText(),
      });
    });
    routes.updateTempRoute({
      texts,
    });
  }, []);

  useEffect(() => {
    if (!routes.isCreating || !map) {
      return;
    }

    const polylines: Polyline[] = [];
    const texts: Marker[] = [];
    routes.tempRoute.positions.forEach((layerPositions) => {
      if (layerPositions.length < 2) {
        return;
      }
      const polylineLayer = leaflet.polyline(
        layerPositions.map(({ position }) => position),
        { pmIgnore: false }
      );
      polylineLayer.on("pm:edit", () => {
        setRoutePolylines(polylines);
        updateGlobalMode();
      });
      polylines.push(polylineLayer);
      polylineLayer.addTo(map);
    });
    routes.tempRoute.texts?.forEach((textPositions) => {
      const textLayer = leaflet.marker(textPositions.position, {
        textMarker: true,
        text: textPositions.text,
        pmIgnore: false,
      });
      textLayer.on("pm:edit", () => {
        setRouteTexts(texts);
        updateGlobalMode();
      });
      textLayer.on("pm:remove", () => {
        texts.splice(texts.indexOf(textLayer), 1);
        setRouteTexts(texts);
        updateGlobalMode();
      });
      texts.push(textLayer);
      textLayer.addTo(map);
    });

    map.on("pm:drawstart", ({ workingLayer, shape }) => {
      if (shape === "Line") {
        polylines.push(workingLayer as Polyline);
        workingLayer.on("pm:vertexadded", (e) => {
          if (nodes.some((node) => e.latlng.equals([node.x, node.y]))) {
            setRoutePolylines(polylines);
          }
        });
        workingLayer.on("pm:vertexremoved", () => {
          setRoutePolylines(polylines);
        });
        workingLayer.on("pm:markerdragend", () => {
          setRoutePolylines(polylines);
        });
        workingLayer.on("pm:edit", () => {
          setRoutePolylines(polylines);
        });
      }
    });

    map.on("pm:drawend", () => {
      setRoutePolylines(polylines);
      updateGlobalMode();
    });

    map.on("pm:create", ({ shape, layer }) => {
      layer.options.pmIgnore = false;
      leaflet.PM.reInitLayer(layer);

      if (shape === "Line") {
        layer.on("pm:edit", () => {
          setRoutePolylines(polylines);
        });
      } else if (shape === "Text") {
        const textLayer = layer as Marker;
        texts.push(textLayer);
        leaflet.Util.setOptions(layer, {
          draggable: true,
        });

        textLayer.pm.enable({});
        const textarea = textLayer.pm.getElement() as HTMLTextAreaElement;
        textarea.focus();

        layer.on("pm:edit", () => {
          updateGlobalMode();
          setRouteTexts(texts);
        });
        layer.on("pm:remove", () => {
          texts.splice(texts.indexOf(textLayer), 1);
          setRouteTexts(texts);
          updateGlobalMode();
        });
      }
    });

    map.pm.enableDraw("Line");
    updateGlobalMode();

    return () => {
      map.pm.disableDraw();
      map.pm.disableGlobalEditMode();
      map.off("pm:drawstart");
      map.off("pm:create");
      map.pm.getGeomanLayers().forEach((layer) => {
        layer.remove();
      });
      routes.resetTempRoute();
    };
  }, [routes.isCreating, map]);

  const [globalMode, setGlobalMode] = useState("none");

  const updateGlobalMode = useCallback(() => {
    if (!map) {
      return;
    }
    if (map.pm.globalRemovalModeEnabled()) {
      setGlobalMode("Removal");
    } else if (map.pm.globalEditModeEnabled()) {
      setGlobalMode("Edit");
    } else if (map.pm.globalDragModeEnabled()) {
      setGlobalMode("Drag");
    } else {
      setGlobalMode(map.pm.Draw.getActiveShape());
    }
  }, [map]);

  if (routes.isCreating) {
    return (
      <div className="divide-y divide-neutral-700 border-t border-t-neutral-600 bg-neutral-900 text-gray-200 text-sm w-full md:border md:border-gray-600 md:rounded-lg" aria-label="Routes">
        <div className="flex leaflet-pm-toolbar flex-wrap">
          <button
            className={`flex gap-1 p-2 uppercase hover:text-white w-1/2 justify-center ${
              globalMode === "Line" ? "bg-gray-700" : ""
            }`}
            onClick={() => {
              map.pm.enableDraw("Line");
              updateGlobalMode();
            }}
          >
            <div className="control-icon leaflet-pm-icon-polyline !w-5 !h-5" />
            <span>Add Line</span>
          </button>
          <button
            className={`flex gap-1 p-2 uppercase hover:text-white w-1/2 justify-center ${
              globalMode === "Text" ? "bg-gray-700" : ""
            }`}
            onClick={() => {
              map.pm.enableDraw("Text");
              updateGlobalMode();
            }}
          >
            <div className="control-icon leaflet-pm-icon-text !w-5 !h-5" />
            <span>Add Text</span>
          </button>
          <button
            className={`flex gap-1 p-2 uppercase hover:text-white w-1/2 justify-center ${
              globalMode === "Edit" ? "bg-gray-700" : ""
            }`}
            onClick={() => {
              map.pm.toggleGlobalEditMode();
              updateGlobalMode();
            }}
          >
            <div className="control-icon leaflet-pm-icon-edit !w-5 !h-5" />
            <span>Edit Mode</span>
          </button>
          <button
            className={`flex gap-1 p-2 uppercase hover:text-white w-1/2 justify-center ${
              globalMode === "Drag" ? "bg-gray-700" : ""
            }`}
            onClick={() => {
              map.pm.toggleGlobalDragMode();
              updateGlobalMode();
            }}
          >
            <div className="control-icon leaflet-pm-icon-drag !w-5 !h-5" />
            <span>Drag Text</span>
          </button>
          <button
            className={`flex gap-1 p-2 uppercase hover:text-white w-1/2 justify-center ${
              globalMode === "Removal" ? "bg-gray-700" : ""
            }`}
            onClick={() => {
              map.pm.toggleGlobalRemovalMode();
              updateGlobalMode();
            }}
          >
            <div className="control-icon leaflet-pm-icon-delete !w-5 !h-5" />
            <span>Delete Text</span>
          </button>
        </div>
        <div className="flex flex-col p-2 gap-1">
          <input
            className="bg-neutral-900 text-gray-200 text-sm px-2 py-1 w-full border border-gray-600 md:rounded-lg outline-none"
            type="text"
            placeholder="Give this route an explanatory name"
            required
            autoFocus
            value={routes.tempRoute.name}
            onChange={(event) =>
              routes.updateTempRoute({ name: event.target.value })
            }
          />
          <p className="text-xs text-neutral-400">
            You can add multiple lines and connect every node on the map.
            Right-click in edit mode removes a vertex.
          </p>
        </div>
        <div className="flex">
          <button
            className="p-2 uppercase hover:text-white w-1/2"
            onClick={() => {
              routes.setIsCreating(false);
            }}
          >
            Cancel
          </button>
          <button
            className={`p-2 uppercase w-1/2 ${
              routes.tempRoute.name.length === 0
                ? "text-gray-500"
                : "hover:text-white"
            }`}
            onClick={() => {
              if (routes.tempRoute.id.length === 0) {
                routes.addRoute({
                  ...routes.tempRoute,
                  id: nanoid(),
                });
              } else {
                routes.editRoute(routes.tempRoute.id, routes.tempRoute);
              }
              routes.setIsCreating(false);
            }}
            disabled={routes.tempRoute.name.length === 0}
          >
            Save
          </button>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`divide-y divide-neutral-700 border-t border-t-neutral-600 bg-neutral-900 text-gray-200 text-sm w-full md:border md:border-gray-600 md:rounded-lg hidden md:block`}
      style={
        showRoutes !== null
          ? {
              display: showRoutes ? "block" : "none",
            }
          : {}
      }
    >
      <div className="flex">
        <button
          className="p-2 uppercase hover:text-white w-1/2"
          onClick={() => {
            routes.setIsCreating(true);
          }}
        >
          Create
        </button>
        <label className="p-2 uppercase hover:text-white w-1/2 text-center">
          <input
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }
              const reader = new FileReader();
              reader.addEventListener("load", (loadEvent) => {
                const text = loadEvent.target?.result;
                if (!text || typeof text !== "string") {
                  return;
                }
                try {
                  const route = JSON.parse(text);
                  if (
                    !Array.isArray(route.types) ||
                    !Array.isArray(route.positions) ||
                    typeof route.name !== "string" ||
                    typeof route.id !== "string"
                  ) {
                    throw new Error("Invalid route");
                  }
                  if (routes.routes.some(({ id }) => id === route.id)) {
                    routes.editRoute(route.id, route);
                  } else {
                    routes.addRoute(route);
                  }
                } catch (error) {
                  // Do nothing
                }
                event.target.value = "";
              });
              reader.readAsText(file);
            }}
          />
          Import
        </label>
      </div>
      <p className="text-xs text-neutral-400 p-2">
        Join the{" "}
        <Link
          target="_blank"
          href="https://discord.com/invite/NTZu8Px"
          className="text-neutral-300 hover:text-white"
        >
          Discord server
        </Link>{" "}
        to explore and share routes with other players. You can also import and
        export routes here.
      </p>
      <div className="overflow-auto max-h-full">
        <RoutesList />
      </div>
    </div>
  );
}
