"use client";
import { isOverwolfApp } from "@/app/lib/env";
import type { NODE } from "@/app/lib/nodes";
import { useMap } from "@/app/lib/storage/map";
import {
  decodeNameAndCoordinates,
  useParamsStore,
} from "@/app/lib/storage/params";
import { useSettingsStore } from "@/app/lib/storage/settings";
import leaflet from "leaflet";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { useDict, useI18N } from "../(i18n)/i18n-provider";
import Marker from "./marker";

export default function Nodes() {
  const map = useMap();
  const featureGroup = useMemo(() => {
    const featureGroup = new leaflet.FeatureGroup();
    return featureGroup;
  }, []);

  useEffect(() => {
    if (!map) {
      return;
    }
    featureGroup.addTo(map);
    return () => {
      featureGroup.removeFrom(map);
    };
  }, [map]);

  const router = useRouter();
  const mapName = useParamsStore((state) => state.mapName);
  const lang = useI18N().locale;

  const dict = useDict();
  const iconSize = useSettingsStore((state) => state.iconSize);
  const visibleNodesByMap = useParamsStore((state) => state.visibleNodesByMap);
  const highlightedNode = useParamsStore((state) => state.highlightedNode);
  const setParams = useParamsStore((state) => state.setParams);

  useEffect(() => {
    const bounds = featureGroup.getBounds();
    if (bounds.isValid() && map) {
      map.fitBounds(bounds, {
        duration: 1,
        maxZoom: 5,
        padding: [70, 70],
      });
    }
  }, [visibleNodesByMap]);

  const onMarkerClick = useCallback(
    (node: NODE) => {
      if (location.pathname.startsWith("/embed")) {
        return;
      }
      let name = "";
      if (!node.isSpawnNode) {
        name = dict.generated[node.type]?.[node.id]?.name ?? "";
      } else {
        name = dict.spawnNodes[node.type].name;
      }
      if (isOverwolfApp) {
        const decoded = decodeNameAndCoordinates({
          name: name || dict.nodes[node.type],
          coordinates: `@${node.x},${node.y}`,
        });
        setParams({
          mapName,
          ...decoded,
          dict,
        });
      } else {
        const url = `/${lang}/${encodeURIComponent(
          dict.maps[mapName]
        )}/${encodeURIComponent(name || dict.nodes[node.type])}/@${node.x},${
          node.y
        }${location.search}`;
        router.prefetch(url);
        router.push(url);
      }
    },
    [mapName]
  );

  return (
    <>
      {visibleNodesByMap[mapName]?.map((node) => (
        <Marker
          key={node.id}
          id={node.id}
          node={node}
          type={node.type}
          isHighlighted={highlightedNode?.id === node.id}
          iconSize={iconSize}
          onClick={onMarkerClick}
          featureGroup={featureGroup}
        />
      ))}
    </>
  );
}
