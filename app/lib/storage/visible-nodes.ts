import { create } from "zustand";
import { DICT } from "../i18n";
import { NODE, nodes } from "../nodes";

export const useVisibleNodeStore = create<{
  visibleNodesByMap: Record<string, NODE[]>;
  highlightedNode: NODE | null;
  refreshVisibleNodes: (props: {
    dict: DICT;
    selectedName?: string;
    coordinates?: number[];
    search?: string;
    isScreenshot?: boolean;
    filters: string[];
  }) => void;
}>((set) => ({
  visibleNodesByMap: {
    "kilima-valley": [],
    "bahari-bay": [],
    fairgrounds: [],
    housing: [],
  },
  highlightedNode: null,
  refreshVisibleNodes: ({
    dict,
    selectedName,
    coordinates,
    search,
    isScreenshot,
    filters,
  }) => {
    let highlightedNode: NODE | null = null;
    const visibleNodesByMap: Record<string, NODE[]> = {};

    nodes.forEach((node) => {
      let isHighlighted = false;
      if (!highlightedNode && selectedName && coordinates) {
        if (node.x === coordinates[0] && node.y === coordinates[1]) {
          isHighlighted = true;
          highlightedNode = node;
        } else if (isScreenshot) {
          return false;
        }
      }

      let isTrivial = false;
      if (!isHighlighted) {
        if (search) {
          isTrivial = !(
            dict.generated[node.type]?.[node.id]?.name
              .toLowerCase()
              .includes(search) ||
            node.id.toLowerCase().includes(search) ||
            dict.spawnNodes[node.type]?.name.toLowerCase().includes(search)
          );
        } else if (!filters.includes(node.type)) {
          isTrivial = true;
        }
      }
      if (!isTrivial) {
        if (!visibleNodesByMap[node.mapName]) {
          visibleNodesByMap[node.mapName] = [];
        }
        visibleNodesByMap[node.mapName].push(node);
      }
    });

    set({ visibleNodesByMap, highlightedNode });
  },
}));
