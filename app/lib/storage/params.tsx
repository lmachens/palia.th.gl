"use client";
import { useDict } from "@/app/components/(i18n)/i18n-provider";
import { useParams, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useRef } from "react";
import { createStore, useStore } from "zustand";
import type { DICT } from "../i18n";
import type { NODE } from "../nodes";
import { nodes, spawnNodes, staticNodes } from "../nodes";

type ParamsProps = {
  lang: string;
  mapName: string;
  name?: string;
  coordinates?: number[];
  search: string;
  query: string;
  screenshot: boolean;
  visibleNodesByMap: Record<string, NODE[]>;
  highlightedNode?: NODE;
  filters: string[];
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
    nodes.forEach((node) => {
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
            node.id.toLowerCase().includes(lowerCaseSearch) ||
            dict.spawnNodes[node.type]?.name
              .toLowerCase()
              .includes(lowerCaseSearch)
          );
        } else if (!filters?.includes(node.type)) {
          isTrivial = true;
        }
      }
      if (!isTrivial) {
        // Add if not already added
        if (!visibleNodesByMap[node.mapName]) {
          visibleNodesByMap[node.mapName] = [];
        }
        visibleNodesByMap[node.mapName].push(node);
        if (
          !changed &&
          !props.visibleNodesByMap[node.mapName]?.some((n) => n.id === node.id)
        ) {
          changed = true;
        }
      } else if (
        !changed &&
        props.visibleNodesByMap[node.mapName]?.some((n) => n.id === node.id)
      ) {
        changed = true;
      }
    });

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

      let url = location.pathname;
      if (props.query) {
        url += "?" + props.query;
      }

      window.history.replaceState(
        { ...window.history.state, as: url, url: url },
        "",
        url
      );
    },
  }));
};

const ParamsContext = createContext<ParamsStore | null>(null);
export const ALL_FILTERS = [
  ...Object.keys(staticNodes),
  ...Object.keys(spawnNodes),
];

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
  if (!storeRef.current) {
    const lang = params.lang as string;
    let mapName = "kilima-valley";
    if (params.map) {
      const mapTitle = decodeURIComponent(params.map as string);
      const mapEntry = Object.entries(dict.maps).find(([, value]) => {
        return value === mapTitle;
      })!;
      mapName = mapEntry[0];
    }
    const query = searchParams.toString();
    const search = searchParams.get("search") || "";
    const screenshot = searchParams.get("screenshot") === "true";
    const { name, coordinates } = decodeNameAndCoordinates(params);
    const filtersString = searchParams.get("filters");
    const filters = filtersString ? filtersString.split(",") : ALL_FILTERS;

    storeRef.current = createParamsStore({
      dict,
      lang,
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
