"use client";
import { useDict } from "@/components/(i18n)/i18n-provider";
import { useParams, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useRef } from "react";
import useSWR from "swr";
import { createStore, useStore } from "zustand";
import { isOverwolfApp } from "../env";
import type { DICT } from "../i18n";
import type { NODE } from "../nodes";
import { PRESETS, getPreset, nodes, staticNodesWithType } from "../nodes";
import { getVillagers } from "../palia-api";
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
  preset: string;
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
    const filters = props.filters.filter((f) => PRESETS.all.includes(f));
    const dict = props.dict;

    let highlightedNode: NODE | undefined = undefined;
    let changed = props.liveMode;
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
              .includes(lowerCaseSearch) ||
            dict.nodes[node.type]?.toLowerCase().includes(lowerCaseSearch)
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
    const preset = getPreset(props.filters);
    return {
      ...props,
      preset,
      highlightedNode,
      visibleNodesByMap: changed ? visibleNodesByMap : props.visibleNodesByMap,
    };
  };

  const props = calcState(initProps);
  return createStore<ParamsState>()((set) => ({
    ...props,
    setParams: (params) => {
      set((state) => {
        const props = calcState({
          ...state,
          ...params,
        });

        const searchParams = new URLSearchParams();
        if (typeof props.search !== "undefined") {
          if (props.search.length > 0) {
            searchParams.set("search", props.search);
          } else {
            searchParams.delete("search");
          }
        }
        const preset = getPreset(props.filters);
        props.preset = preset;
        if (preset === "init") {
          searchParams.delete("filters");
        } else if (preset === "custom") {
          searchParams.set("filters", props.filters.join(","));
        } else {
          searchParams.set("filters", preset);
        }

        props.query = searchParams.toString();
        if (isOverwolfApp) {
          localStorage.setItem("params", JSON.stringify(props));
        } else if (props.query !== window.location.search) {
          if (props.query) {
            history.pushState(
              null,
              "",
              window.location.pathname + "?" + props.query
            );
          } else {
            history.pushState(null, "", window.location.pathname);
          }
        }

        return props;
      });
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

  const revalidateVillagers = !liveMode;
  const {
    data: { nodes: villagers, newestTimestamp },
  } = useSWR("villagers", getVillagers, {
    refreshInterval: revalidateVillagers ? 30000 : 0,
    revalidateOnFocus: revalidateVillagers,
    revalidateOnMount: revalidateVillagers,
    fallbackData: { nodes: [], newestTimestamp: 0 },
  });

  if (!storeRef.current) {
    if (isOverwolfApp) {
      try {
        const lastParams = localStorage.getItem("params");
        if (lastParams) {
          const props = JSON.parse(lastParams);
          storeRef.current = createParamsStore(props);
        }
      } catch (e) {
        //
      }
    }

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
      const filters = filtersString ? filtersString.split(",") : PRESETS.init;
      const preset = getPreset(filters);
      storeRef.current = createParamsStore({
        nodes: liveMode
          ? [...staticNodesWithType, ...spawnNodes]
          : [...nodes, ...villagers],
        liveMode,
        dict,
        mapName,
        search,
        query,
        screenshot,
        name,
        coordinates,
        filters,
        preset,
        visibleNodesByMap: {
          "kilima-valley": [],
          "bahari-bay": [],
          fairgrounds: [],
          housing: [],
        },
      });
    }
  }

  useEffect(() => {
    if (isInitialRender || !storeRef.current || isOverwolfApp) {
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
      nodes: liveMode
        ? [...staticNodesWithType, ...spawnNodes]
        : [...nodes, ...villagers],
      dict,
    });
  }, [liveMode, spawnNodes, newestTimestamp]);

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
