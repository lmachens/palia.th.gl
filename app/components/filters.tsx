"use client";
import Image from "next/image";
import { Fragment } from "react";
import { isOverwolfApp } from "../lib/env";
import { ICONS, SPAWN_ICONS } from "../lib/icons";
import type { spawnNodes } from "../lib/nodes";
import { staticNodes } from "../lib/nodes";
import { spawnGroups } from "../lib/spawn-groups";
import {
  ALL_FILTERS,
  useGlobalSettingsStore,
} from "../lib/storage/global-settings";
import { useDict } from "./(i18n)/i18n-provider";
import useFilters from "./use-filters";

export default function Filters() {
  const dict = useDict();
  const [filters, toggleFilter, setFilters] = useFilters();
  const showFilters = useGlobalSettingsStore((state) => state.showFilters);

  return (
    <div
      className={`divide-y divide-neutral-700 border-t border-t-neutral-600 bg-neutral-900 text-gray-200 text-sm w-full md:border md:border-gray-600 md:rounded-lg overflow-auto ${
        showFilters ? "block" : "hidden"
      }`}
    >
      <div className="flex">
        <button
          className="p-2 uppercase hover:text-white w-1/2"
          onClick={() => {
            setFilters(ALL_FILTERS);
          }}
        >
          {dict.nodes.showAll}
        </button>
        <button
          className="p-2 uppercase hover:text-white w-1/2"
          onClick={() => {
            setFilters([]);
          }}
        >
          {dict.nodes.hideAll}
        </button>
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
      <div className="flex flex-wrap ">
        {Object.entries(spawnGroups).map(([key, group]) => {
          return (
            <Fragment key={key}>
              <button
                className={`flex gap-2 items-center hover:bg-neutral-700 p-2 basis-full truncate ${
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
              {group.map((_key) => {
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
