"use client";
import { useOverwolfRouter } from "@/app/(overwolf)/components/overwolf-router";
import { NODE } from "@/app/lib/nodes";
import { useDiscoveredNodesStore } from "@/app/lib/storage/discovered-nodes";
import { useGlobalSettingsStore } from "@/app/lib/storage/global-settings";
import { useVisibleNodeStore } from "@/app/lib/storage/visible-nodes";
import leaflet from "leaflet";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { useDict } from "../(i18n)/i18n-provider";
import { useMap } from "./map";
import Marker from "./marker";

export default function Nodes({ map: mapName }: { map: string }) {
  const map = useMap();
  const featureGroup = useMemo(() => {
    const featureGroup = new leaflet.FeatureGroup();
    return featureGroup;
  }, []);

  useEffect(() => {
    featureGroup.addTo(map);
    return () => {
      featureGroup.removeFrom(map);
    };
  }, [map]);

  const overwolfRouter = useOverwolfRouter();
  const router = useRouter();
  const params = useParams()!;
  const { discoveredNodes, toggleDiscoveredNode } = useDiscoveredNodesStore();

  const dict = useDict();
  const iconSize = useGlobalSettingsStore((state) => state.iconSize);
  const { visibleNodesByMap, highlightedNode } = useVisibleNodeStore();

  useEffect(() => {
    const bounds = featureGroup.getBounds();
    if (bounds.isValid()) {
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
      if (overwolfRouter) {
        overwolfRouter.update({
          name: encodeURIComponent(name || dict.nodes[node.type]),
          mapName,
          coordinates: `@${node.x},${node.y}`,
        });
      } else {
        const url = `/${params.lang}/${encodeURIComponent(
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
          isDiscovered={discoveredNodes.includes(node.id)}
          iconSize={iconSize}
          onClick={onMarkerClick}
          onContextMenu={toggleDiscoveredNode}
          featureGroup={featureGroup}
        />
      ))}
    </>
  );
}
