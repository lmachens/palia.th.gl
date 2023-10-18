"use client";
import { useDict } from "@/app/components/(i18n)/i18n-provider";
import { useParams, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useRef } from "react";
import { createStore, useStore } from "zustand";
import { isOverwolfApp } from "../env";
import type { DICT } from "../i18n";
import type { NODE } from "../nodes";
import { ALL_FILTERS, nodes, staticNodesWithType } from "../nodes";
import { useGameInfoStore } from "./game-info";
import { useSettingsStore } from "./settings";

type ParamsProps = {
  mapName: string;
  name?: string;
  coordinates?: number[];
  search: string;
  query: string;
  screenshot: boolean;
  visibleNodesByMap: Record<string, NODE[]>;
  highlightedNode?: NODE;
  filters: string[];
  nodes: NODE[];
  liveMode: boolean;
};

type ParamsState = {
  setParams: (
    params: Partial<Omit<ParamsProps, "query">> & { dict: DICT }
  ) => void;
} & ParamsProps;

type ParamsStore = ReturnType<typeof createParamsStore>;

const createParamsStore = (initProps: ParamsProps & { dict: DICT }) => {
  const calcState = (props: ParamsProps & { dict: DICT }) => {
    const name = props.name;
    const coordinates = props.coordinates;
    const screenshot = props.screenshot;
    const search = props.search;
    const filters = props.filters.filter((f) => ALL_FILTERS.includes(f));
    const dict = props.dict;

    let highlightedNode: NODE | undefined = undefined;
    let changed = false;
    const visibleNodesByMap: Record<string, NODE[]> = {};
    props.nodes.forEach((node) => {
      let isHighlighted = false;
      if (!highlightedNode && name && coordinates) {
        if (node.x === coordinates[0] && node.y === coordinates[1]) {
          isHighlighted = true;
          highlightedNode = node;
        } else if (screenshot) {
          return false;
        }
      }

      let isTrivial = false;
      if (!isHighlighted) {
        if (search) {
          const lowerCaseSearch = search.toLowerCase();
          isTrivial = !(
            dict.generated[node.type]?.[node.id]?.name
              .toLowerCase()
              .includes(lowerCaseSearch) ||
            dict.spawnNodes[node.type]?.name
              .toLowerCase()
              .includes(lowerCaseSearch)
          );
        } else if (!filters?.includes(node.type)) {
          isTrivial = true;
        }
      }
      if (!isTrivial) {
        if (!visibleNodesByMap[node.mapName]) {
          visibleNodesByMap[node.mapName] = [];
        }
        if (
          !props.liveMode ||
          !visibleNodesByMap[node.mapName].some((n) => n.id === node.id)
        ) {
          visibleNodesByMap[node.mapName].push(node);
          if (
            !changed &&
            !props.visibleNodesByMap[node.mapName]?.some(
              (n) => n.id === node.id
            )
          ) {
            changed = true;
          }
        }
      } else if (
        !changed &&
        props.visibleNodesByMap[node.mapName]?.some((n) => n.id === node.id)
      ) {
        changed = true;
      }
    });
    if (!changed) {
      const oldTotal = Object.values(props.visibleNodesByMap).reduce(
        (acc, nodes) => acc + nodes.length,
        0
      );
      const newTotal = Object.values(visibleNodesByMap).reduce(
        (acc, nodes) => acc + nodes.length,
        0
      );
      changed = oldTotal !== newTotal;
    }
    return {
      ...props,
      highlightedNode,
      visibleNodesByMap: changed ? visibleNodesByMap : props.visibleNodesByMap,
    };
  };

  const props = calcState(initProps);
  return createStore<ParamsState>()((set, get) => ({
    ...props,
    setParams: (params) => {
      const state = get();
      const props = calcState({
        ...state,
        ...params,
      });

      const searchParams = new URLSearchParams(location.search);
      if (typeof props.search !== "undefined") {
        if (props.search.length > 0) {
          searchParams.set("search", props.search);
        } else {
          searchParams.delete("search");
        }
      }
      if (props.filters.length === 0) {
        searchParams.set("filters", "none");
      } else if (props.filters.length !== ALL_FILTERS.length) {
        searchParams.set("filters", props.filters.join(","));
      } else {
        searchParams.delete("filters");
      }
      props.query = searchParams.toString();

      set(props);

      if (!isOverwolfApp) {
        let url = location.pathname;
        if (props.query) {
          url += "?" + props.query;
        }

        window.history.replaceState(
          { ...window.history.state, as: url, url: url },
          "",
          url
        );
      }
    },
  }));
};

const ParamsContext = createContext<ParamsStore | null>(null);

export function decodeNameAndCoordinates({
  name,
  coordinates,
}: {
  name?: string;
  coordinates?: string;
}) {
  const decodedName = name && decodeURIComponent(name as string);
  const decodedCoordinates = (
    coordinates && decodeURIComponent(coordinates as string)
  )
    ?.replace("@", "")
    .split(",")
    .map(Number);
  return { name: decodedName, coordinates: decodedCoordinates };
}
export function ParamsProvider({ children }: { children: React.ReactNode }) {
  const dict = useDict();
  const params = useParams();
  const searchParams = useSearchParams();
  const storeRef = useRef<ParamsStore>();
  const isInitialRender = !storeRef.current;
  const liveMode = useSettingsStore((state) => state.liveMode);
  const spawnNodes = useGameInfoStore((state) => state.spawnNodes);

  if (!storeRef.current) {
    let mapName = "kilima-valley";
    if (params.map) {
      const mapTitle = decodeURIComponent(params.map as string);
      const mapEntry = Object.entries(dict.maps).find(([, value]) => {
        return value === mapTitle;
      });
      if (mapEntry) {
        mapName = mapEntry[0];
      }
    }
    const query = searchParams.toString();
    const search = searchParams.get("search") || "";
    const screenshot = searchParams.get("screenshot") === "true";
    const { name, coordinates } = decodeNameAndCoordinates(params);
    const filtersString = searchParams.get("filters");
    const filters = filtersString ? filtersString.split(",") : ALL_FILTERS;

    storeRef.current = createParamsStore({
      nodes: liveMode ? [...staticNodesWithType, ...spawnNodes] : nodes,
      liveMode,
      dict,
      mapName,
      search,
      query,
      screenshot,
      name,
      coordinates,
      filters,
      visibleNodesByMap: {
        "kilima-valley": [],
        "bahari-bay": [],
        fairgrounds: [],
        housing: [],
      },
    });
  }

  useEffect(() => {
    if (isInitialRender || !storeRef.current) {
      return;
    }
    const { name, coordinates } = decodeNameAndCoordinates(params);

    storeRef.current.getState().setParams({
      name,
      coordinates,
      dict,
    });
  }, [params.name, params.coordinates]);

  useEffect(() => {
    if (isInitialRender || !storeRef.current) {
      return;
    }
    const state = storeRef.current.getState();
    if (!liveMode && state.nodes === nodes) {
      return;
    }
    storeRef.current.getState().setParams({
      liveMode,
      nodes: liveMode ? [...staticNodesWithType, ...spawnNodes] : nodes,
      dict,
    });
  }, [liveMode, spawnNodes]);

  return (
    <ParamsContext.Provider value={storeRef.current}>
      {children}
    </ParamsContext.Provider>
  );
}

export function useParamsStore<T>(selector: (state: ParamsState) => T): T {
  const store = useContext(ParamsContext);
  if (!store) {
    throw new Error("Missing ParamsContext.Provider in the tree");
  }
  return useStore(store, selector);
}
