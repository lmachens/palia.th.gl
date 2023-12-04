"use client";
import { isOverwolfApp } from "@/lib/env";
import { filterGroups } from "@/lib/filter-groups";
import { ICONS, SPAWN_ICONS } from "@/lib/icons";
import type { spawnNodes } from "@/lib/nodes";
import { ALL_FILTERS, hideOnWeb, staticNodes } from "@/lib/nodes";
import { spawnGroups } from "@/lib/spawn-groups";
import { useGlobalSettingsStore } from "@/lib/storage/global-settings";
import { useParamsStore } from "@/lib/storage/params";
import Image from "next/image";
import { Fragment, useCallback } from "react";
import { useDict } from "./(i18n)/i18n-provider";

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
            setParams({ filters: ALL_FILTERS, dict });
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
      <div className="flex flex-wrap">
        {Object.keys(staticNodes).map((_key) => {
          const key = _key as keyof typeof staticNodes;
          if (!isOverwolfApp && hideOnWeb.includes(key)) {
            return <Fragment key={key}></Fragment>;
          }
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
      <div className="flex flex-wrap justify-start">
        {Object.entries(spawnGroups).map(([key, group]) => {
          return (
            <Fragment key={key}>
              <div className={"flex basis-full h-0"}></div>
              <button
                className={`flex gap-2 grow text-left items-left hover:bg-neutral-700 p-2 basis-1/5  ${
                  !filters.some((filter) => group.includes(filter))
                    ? "text-gray-500"
                    : ""
                }`}
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
                        {dict.spawnNodes[key].name}
                      </span>
                    </button>
                  );
                })}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}