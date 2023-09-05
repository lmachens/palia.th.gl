"use client";
import { useOverwolfRouter } from "@/app/(overwolf)/components/overwolf-router";
import { NODE, nodes } from "@/app/lib/nodes";
import { useDiscoveredNodesStore } from "@/app/lib/storage/discovered-nodes";
import { useGlobalSettingsStore } from "@/app/lib/storage/global-settings";
import leaflet from "leaflet";
import { useParams, useSearchParams } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo } from "react";
import { useDict } from "../(i18n)/i18n-provider";
import useFilters from "../use-filters";
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

  const router = useOverwolfRouter();
  const params = useParams()!;
  const searchParams = useSearchParams()!;
  const { discoveredNodes, toggleDiscoveredNode } = useDiscoveredNodesStore();
  const isOverwolf = "value" in router;
  const search = useMemo(() => {
    return (
      (isOverwolf ? router.value.search : searchParams.get("search")) ?? ""
    ).toLowerCase();
  }, [searchParams, isOverwolf && router.value.search]);
  const isScreenshot = searchParams.get("screenshot") === "true";
  const dict = useDict();
  const iconSize = useGlobalSettingsStore((state) => state.iconSize);

  const paramsName = isOverwolf ? router.value.name : params.name;
  const paramsCoordinates = isOverwolf
    ? router.value.coordinates
    : params.coordinates;
  const [filters] = useFilters();

  const selectedName = useMemo(
    () => paramsName && decodeURIComponent(paramsName as string),
    [paramsName]
  );
  const coordinates = useMemo(
    () =>
      (paramsCoordinates && decodeURIComponent(paramsCoordinates as string))
        ?.replace("@", "")
        .split(",")
        .map(Number) ?? [],
    [paramsCoordinates]
  );

  useEffect(() => {
    if (!search) {
      return;
    }
    const bounds = featureGroup.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        duration: 1,
        maxZoom: 5,
        padding: [25, 25],
      });
    }
  }, [search]);

  const onMarkerClick = useCallback((node: NODE) => {
    if (location.pathname.startsWith("/embed")) {
      return;
    }
    let name = "";
    if (!node.isSpawnNode) {
      name = dict.generated[node.type]?.[node.id]?.name ?? "";
    } else {
      name = dict.spawnNodes[node.type].name;
    }
    if ("update" in router) {
      router.update({
        name: encodeURIComponent(name || node.type),
        mapName,
        coordinates: `@${node.x},${node.y}`,
      });
    } else {
      const url = `/${params.lang}/${mapName}/nodes/${encodeURIComponent(
        name
      )}/@${node.x},${node.y}${location.search}`;
      router.prefetch(url);
      router.push(url);
    }
  }, []);

  const visibleNodes = useMemo(() => {
    return nodes.filter((node) => {
      return mapName === node.mapName;
    });
  }, [mapName]);

  return (
    <>
      {visibleNodes.map((node) => {
        let isHighlighted = false;
        if (selectedName && coordinates) {
          const name =
            (!node.isSpawnNode
              ? dict.generated[node.type]?.[node.id]?.name
              : dict.spawnNodes[node.type].name) ?? "";
          if (
            node.x === coordinates[0] &&
            node.y === coordinates[1] &&
            (name || node.type) === selectedName
          ) {
            isHighlighted = true;
          } else if (isScreenshot) {
            return <Fragment key={node.id} />;
          }
        }

        let isTrivial = false;
        if (!filters.includes(node.type) && !isHighlighted) {
          isTrivial = true;
        } else if (search && !isHighlighted) {
          // @ts-ignore
          const name = dict.generated[node.type]?.[node.id]?.name ?? "";

          isTrivial = !(
            name.toLowerCase().includes(search) ||
            node.id.toLowerCase().includes(search) ||
            dict.nodes[node.type]?.toLowerCase().includes(search) ||
            dict.spawnNodes[node.type]?.name.toLowerCase().includes(search)
          );
        }

        if (isTrivial) {
          return <Fragment key={node.id} />;
        }
        return (
          <Marker
            key={node.id}
            id={node.id}
            node={node}
            type={node.type}
            isHighlighted={isHighlighted}
            isDiscovered={discoveredNodes.includes(node.id)}
            iconSize={iconSize}
            onClick={onMarkerClick}
            onContextMenu={toggleDiscoveredNode}
            featureGroup={featureGroup}
          />
        );
      })}
    </>
  );
}
