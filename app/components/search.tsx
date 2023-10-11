"use client";

import { isOverwolfApp } from "../lib/env";
import { useGameInfoStore } from "../lib/storage/game-info";
import { useGlobalSettingsStore } from "../lib/storage/global-settings";
import { ALL_FILTERS, useParamsStore } from "../lib/storage/params";
import { useSettingsStore } from "../lib/storage/settings";
import { useDict } from "./(i18n)/i18n-provider";
import AppDownload from "./app-download";
import Filters from "./filters";
import Maps from "./maps";
import Routes from "./routes";
import SearchResults from "./search-results";

export default function Search({
  hidden,
  children,
}: {
  hidden?: boolean;
  children?: React.ReactNode;
}) {
  const dict = useDict();
  const search = useParamsStore((state) => state.search);
  const setParams = useParamsStore((state) => state.setParams);
  const filters = useParamsStore((state) => state.filters);
  const settingsStore = useSettingsStore();
  const globalSettingsStore = useGlobalSettingsStore();
  const isOverlay = useGameInfoStore((state) => state.isOverlay);
  const mapName = useParamsStore((state) => state.mapName);

  if (hidden) {
    return <></>;
  }

  return (
    <div
      className={`absolute pointer-events-none ${
        isOverwolfApp ? "top-[42px]" : "top-0 md:top-3"
      } w-full md:w-auto right-0 md:right-1 z-[400] transition-all duration-500 ${
        globalSettingsStore.showSidebar ? "md:left-[412px]" : "md:left-3"
      } md:space-y-1`}
    >
      <div
        className={`bg-black md:bg-transparent flex overflow-auto pointer-events-auto pb-1 w-fit`}
      >
        {!isOverwolfApp && <AppDownload />}
        {(!settingsStore.lockedWindow || !isOverlay) && children}
      </div>
      {(!settingsStore.lockedWindow || !isOverlay) && (
        <div className={`relative pointer-events-auto flex md:w-fit`}>
          <button
            className="menu flex absolute inset-y-0 left-0 items-center pl-2 text-gray-400 hover:text-gray-200"
            onClick={globalSettingsStore.toggleShowSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="block w-5"
            >
              <path d="M4 6l16 0" />
              <path d="M4 12l16 0" />
              <path d="M4 18l16 0" />
            </svg>
            <div className="h-3/6 w-px bg-gray-600 mx-1.5" />
          </button>
          <input
            className="bg-neutral-900 text-gray-200 text-sm pl-11 pr-16 py-2.5 w-full md:border md:border-gray-600 md:rounded-lg outline-none search"
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
              className="flex absolute inset-y-0 right-12 items-center pr-2 text-gray-400 hover:text-gray-200"
              onClick={() => setParams({ search: "", dict })}
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
            <div className="flex absolute inset-y-0 right-12 items-center pr-2 text-gray-400">
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
            className={`flex absolute inset-y-0 right-6 items-center pr-2 text-gray-400 hover:text-gray-200 md:text-white`}
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
          >
            <svg
              className="block w-5"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill={
                filters.length !== ALL_FILTERS.length ? "currentColor" : "none"
              }
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z" />
            </svg>
          </button>
          <button
            className={`flex absolute inset-y-0 right-0 items-center pr-2 text-gray-400 hover:text-gray-200 ${
              globalSettingsStore.showRoutes ? "text-white" : ""
            }`}
            onClick={globalSettingsStore.toggleShowRoutes}
          >
            <svg
              className="block w-5 h-5"
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
          <div
            className={`absolute top-full text-sm w-full md:mt-1 max-h-[calc(100vh-100px)] flex flex-col md:gap-2 pb-4`}
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
