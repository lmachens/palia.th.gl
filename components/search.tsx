"use client";

import { useGameInfoStore } from "@/lib/storage/game-info";
import { useGlobalSettingsStore } from "@/lib/storage/global-settings";
import { useParamsStore } from "@/lib/storage/params";
import { useSettingsStore } from "@/lib/storage/settings";
import { cn } from "@/lib/utils";
import { useDict } from "./(i18n)/i18n-provider";
import Filters from "./filters";
import Maps from "./maps";
import Routes from "./routes";
import SearchResults from "./search-results";
import type { ReactNode } from "react";

export default function Search({ children }: { children?: ReactNode }) {
  const dict = useDict();
  const search = useParamsStore((state) => state.search);
  const setParams = useParamsStore((state) => state.setParams);
  const preset = useParamsStore((state) => state.preset);
  const settingsStore = useSettingsStore();
  const globalSettingsStore = useGlobalSettingsStore();
  const isOverlay = useGameInfoStore((state) => state.isOverlay);
  const mapName = useParamsStore((state) => state.mapName);

  return (
    <div
      className={cn(
        `fixed pointer-events-none top-[50px] md:top-[60px] w-full md:w-auto right-0 md:right-1 z-[400] transition-all duration-500md:space-y-1 md:left-3`
      )}
    >
      {(!settingsStore.lockedWindow || !isOverlay) && (
        <div
          className={`relative pointer-events-auto flex md:w-fit min-w-[300px]`}
        >
          <input
            className="bg-neutral-900 text-gray-200 text-sm pl-4 pr-22 py-2.5 w-full md:border md:border-gray-600 md:rounded-lg outline-none search"
            type="text"
            placeholder={dict.search.placeholder}
            value={search}
            onChange={(event) =>
              setParams({ search: event.target.value, dict })
            }
            autoComplete="off"
            autoCorrect="off"
            autoFocus
          />
          {search ? (
            <button
              className="flex absolute inset-y-0 right-20 items-center pr-2 text-gray-400 hover:text-gray-200"
              onClick={() => setParams({ search: "", dict })}
              type="button"
            >
              <svg
                className="block w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M18 6l-12 12"></path>
                <path d="M6 6l12 12"></path>
              </svg>
              <div className="h-3/6 w-px bg-gray-600 mx-1.5" />
            </button>
          ) : (
            <div className="flex absolute inset-y-0 right-20 items-center pr-2 text-gray-400">
              <svg
                className="block w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <div className="h-3/6 w-px bg-gray-600 mx-1.5" />
            </div>
          )}
          <button
            className={`flex absolute inset-y-0 right-14 items-center pr-2 text-gray-400 hover:text-gray-200 md:text-white`}
            style={
              globalSettingsStore.showFilters !== null
                ? {
                    color: globalSettingsStore.showFilters
                      ? "white"
                      : "#9ca3af",
                  }
                : {}
            }
            onClick={globalSettingsStore.toggleShowFilters}
            type="button"
            aria-haspopup="menu"
            aria-label="Open filters"
            aria-expanded={!!globalSettingsStore.showFilters}
          >
            <svg
              className="block w-5"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill={preset !== "init" ? "currentColor" : "none"}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z" />
            </svg>
          </button>
          <button
            className={cn(
              "flex absolute inset-y-0 right-8 items-center pr-2 text-gray-400 hover:text-gray-200 md:text-white"
            )}
            style={
              globalSettingsStore.showRoutes !== null
                ? {
                    color: globalSettingsStore.showRoutes ? "white" : "#9ca3af",
                  }
                : {}
            }
            onClick={globalSettingsStore.toggleShowRoutes}
            type="button"
            aria-haspopup="menu"
            aria-label="Open routes"
            aria-expanded={!!globalSettingsStore.showRoutes}
          >
            <svg
              className="block w-5"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M5 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
              <path d="M7 19h3a2 2 0 0 0 2 -2v-8a2 2 0 0 1 2 -2h7"></path>
              <path d="M18 4l3 3l-3 3"></path>
            </svg>
          </button>
          {children}

          <div
            className={cn(
              `absolute top-full text-sm w-full md:mt-1 max-h-[calc(100vh-90px)] md:max-h-[calc(100vh-120px)] flex flex-col md:gap-2`
            )}
          >
            <Maps />
            <Routes />
            {search ? <SearchResults map={mapName} /> : <Filters />}
          </div>
        </div>
      )}
    </div>
  );
}
