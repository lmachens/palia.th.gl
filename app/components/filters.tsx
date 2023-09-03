"use client";
import Image from "next/image";
import { ICONS, SPAWN_ICONS } from "../lib/icons";
import { spawnNodes, staticNodes } from "../lib/nodes";
import { ALL_FILTERS } from "../lib/storage/global-settings";
import { useDict } from "./(i18n)/i18n-provider";
import useFilters from "./use-filters";

export default function Filters() {
  const dict = useDict();
  const [filters, toggleFilter, setFilters] = useFilters();

  return (
    <div className="divide-y divide-neutral-700 border-t border-t-neutral-600 bg-neutral-900 text-gray-200 text-sm w-full md:border md:border-gray-600 md:rounded-lg">
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
              {"src" in icon ? (
                <Image
                  src={icon.src as string}
                  width={20}
                  height={20}
                  alt=""
                  className="h-5 w-5 shrink-0"
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
              <span className="truncate">{dict.nodes[key]}</span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap ">
        {Object.keys(spawnNodes).map((_key) => {
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
              <span className="truncate">{dict.spawnNodes[key].name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
