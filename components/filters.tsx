"use client";
import { isOverwolfApp } from "@/lib/env";
import { filterGroups } from "@/lib/filter-groups";
import { ICONS, SPAWN_ICONS } from "@/lib/icons";
import type { spawnNodes } from "@/lib/nodes";
import { PRESETS, staticNodes } from "@/lib/nodes";
import { spawnGroups } from "@/lib/spawn-groups";
import { useGlobalSettingsStore } from "@/lib/storage/global-settings";
import { useParamsStore } from "@/lib/storage/params";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCallback } from "react";
import { useDict } from "./(i18n)/i18n-provider";
import FiltersPreset from "./filters-preset";

const rarityStars = {
  common: "★",
  uncommon: "★★",
  rare: "★★★",
  epic: "★★★★",
} as const;

export default function Filters() {
  const dict = useDict();
  const filters = useParamsStore((state) => state.filters);
  const setParams = useParamsStore((state) => state.setParams);
  const showFilters = useGlobalSettingsStore((state) => state.showFilters);

  const toggleFilter = useCallback(
    (key: string | string[]) => {
      if (Array.isArray(key)) {
        const newFilters = filters.some((filter) => key.includes(filter))
          ? filters.filter((f) => !key.includes(f))
          : [...filters, ...key];
        setParams({ filters: newFilters, dict });
      } else {
        const newFilters = filters.includes(key)
          ? filters.filter((f) => f !== key)
          : [...filters, key];
        setParams({ filters: newFilters, dict });
      }
    },
    [filters, dict]
  );

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
      aria-label="Filters"
    >
      <div className="flex">
        <button
          className="p-2 uppercase hover:text-white w-1/2"
          onClick={() => {
            setParams({ filters: PRESETS.all, dict });
          }}
        >
          {dict.nodes.showAll}
        </button>
        <button
          className="p-2 uppercase hover:text-white w-1/2"
          onClick={() => {
            setParams({ filters: [], dict });
          }}
        >
          {dict.nodes.hideAll}
        </button>
      </div>
      <div className="overflow-auto max-h-full">
        <FiltersPreset />
      </div>
      <div className="flex flex-wrap">
        {Object.keys(staticNodes).map((_key) => {
          const key = _key as keyof typeof staticNodes;
          const icon = ICONS[key];
          return (
            <button
              key={key}
              className={`flex gap-2 items-center hover:bg-neutral-700 p-2 basis-1/2 truncate ${
                !filters.includes(key) ? "text-gray-500" : ""
              }`}
              onClick={() => {
                toggleFilter(key);
              }}
              title={dict.nodes[key]}
            >
              <Image
                src={icon.src as string}
                width={20}
                height={20}
                alt=""
                className="h-5 w-5 shrink-0"
                unoptimized={isOverwolfApp}
              />
              <span className="truncate">{dict.nodes[key]}</span>
            </button>
          );
        })}
      </div>
      {Object.entries(spawnGroups).map(([key, group]) => {
        return (
          <div className="flex flex-wrap justify-start" key={key}>
            <div className="grow flex w-full">
              <button
                className={cn(
                  "grow flex gap-2 text-left items-left hover:bg-neutral-700 p-2 uppercase",
                  {
                    "text-gray-500": !filters.some((filter) =>
                      group.includes(filter)
                    ),
                  }
                )}
                onClick={() => {
                  toggleFilter(group);
                }}
                title={dict.groups[key]}
              >
                <span className="truncate">{dict.groups[key]}</span>
              </button>
              {key in filterGroups &&
                Object.entries(filterGroups[key]).map(([filterKey, entry]) => {
                  return (
                    <button
                      key={filterKey}
                      className={`flex-1 text-center shrink gap-2 items-center hover:bg-neutral-700 p-2  ${
                        !filters.some((filter) => entry.includes(filter))
                          ? "text-gray-500"
                          : "text-" + filterKey
                      }`}
                      onClick={() => {
                        toggleFilter(entry);
                      }}
                    >
                      {rarityStars[filterKey as keyof typeof rarityStars]}
                    </button>
                  );
                })}
            </div>
            {group
              .sort((a, b) =>
                dict.spawnNodes[a].name.localeCompare(dict.spawnNodes[b].name)
              )
              .map((_key) => {
                const key = _key as keyof typeof spawnNodes;
                const icon = SPAWN_ICONS[key];

                return (
                  <button
                    key={key}
                    className={`flex gap-2 items-center hover:bg-neutral-700 p-2 basis-1/2 truncate ${
                      !filters.includes(key) ? "text-gray-500" : ""
                    }`}
                    onClick={() => {
                      toggleFilter(key);
                    }}
                    title={dict.spawnNodes[key].name}
                  >
                    <Image
                      src={icon.src as string}
                      width={20}
                      height={20}
                      alt=""
                      className="h-5 w-5 shrink-0"
                      unoptimized={isOverwolfApp}
                    />
                    <span className="truncate">
                      {dict.spawnNodes[key].name}
                    </span>
                  </button>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}
