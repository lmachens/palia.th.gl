"use client";

import Image from "next/image";
import { useMemo } from "react";
import { isOverwolfApp } from "../lib/env";
import { ICONS, SPAWN_ICONS } from "../lib/icons";
import type { NODE } from "../lib/nodes";
import { useGlobalSettingsStore } from "../lib/storage/global-settings";
import { useMap } from "../lib/storage/map";
import { useParamsStore } from "../lib/storage/params";
import { useDict } from "./(i18n)/i18n-provider";

export default function SearchResults({ map: mapName }: { map: string }) {
  const map = useMap();
  const visibleNodesByMap = useParamsStore((state) => state.visibleNodesByMap);

  const dict = useDict();
  const showFilters = useGlobalSettingsStore((state) => state.showFilters);

  const nodes = useMemo(() => {
    if (!visibleNodesByMap[mapName]) {
      return [];
    }
    const nodes = visibleNodesByMap[mapName].reduce(
      (acc, node) => {
        if (!acc[node.type]) {
          acc[node.type] = [];
        }
        acc[node.type].push(node);
        return acc;
      },
      {} as {
        [type: string]: NODE[];
      }
    );
    return Object.entries(nodes);
  }, [visibleNodesByMap, mapName]);

  return (
    <div
      className={`divide-y divide-neutral-700 border-t border-t-neutral-600 bg-neutral-900 text-gray-200 text-sm w-full md:border md:border-gray-600 md:rounded-lg overflow-auto hidden md:block`}
      style={
        showFilters !== null
          ? {
              display: showFilters ? "block" : "none",
            }
          : {}
      }
      aria-label="Search results"
    >
      {nodes.length === 0 && (
        <div className="p-2 text-center">{dict.search.noResults}</div>
      )}
      {nodes.map(([type, nodes]) => {
        const isSpawnNode = nodes[0].isSpawnNode;
        const icon = isSpawnNode
          ? SPAWN_ICONS[type]
          : ICONS[type as keyof typeof ICONS];
        return (
          <button
            key={type}
            className={`flex gap-2 items-center hover:bg-neutral-700 p-2 truncate w-full`}
            onClick={() => {
              const bounds = nodes.map(
                (node) => [node.y, node.x] as [number, number]
              );
              map.fitBounds(bounds, {
                duration: 1,
                maxZoom: 5,
                padding: [25, 25],
              });
            }}
            title={isSpawnNode ? dict.spawnNodes[type].name : dict.nodes[type]}
          >
            {"src" in icon ? (
              <Image
                src={icon.src as string}
                width={20}
                height={20}
                alt=""
                className="h-5 w-5 shrink-0"
                unoptimized={isOverwolfApp}
              />
            ) : (
              <svg
                viewBox="0 0 100 100"
                fill={icon.color}
                className="h-5 w-5 shrink-0"
              >
                <path d={icon.path} />
              </svg>
            )}
            <span className="truncate">
              {isSpawnNode ? dict.spawnNodes[type].name : dict.nodes[type]} (
              {nodes.length})
            </span>
          </button>
        );
      })}
    </div>
  );
}
