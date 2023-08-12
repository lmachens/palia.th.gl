import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NODE_TYPE, getID, nodes, staticNodes } from "../nodes";
import { withStorageDOMEvents } from "./dom";

function filterDiscoveredNodes(discoveredNodes: string[]) {
  try {
    if (!Array.isArray(discoveredNodes)) {
      return [];
    } else if (
      discoveredNodes.some((node: unknown) => typeof node !== "string")
    ) {
      return [];
    }
    return [
      ...new Set(
        discoveredNodes
          .map((nodeId) => {
            if (nodes.some((node) => node.id === nodeId)) {
              return nodeId;
            }
            const [type, rest] = nodeId.split(":");
            if (!rest) {
              return null;
            }
            if (!(type in staticNodes)) {
              return null;
            }
            const name = rest.split("-")[0];
            if (!name) {
              return null;
            }

            let node = (
              staticNodes[
                type as keyof typeof staticNodes
              ] as (typeof staticNodes)[keyof typeof staticNodes]
            ).find(
              (node) => ("name" in node && (node.name as string)) === name,
            );
            if (!node) {
              if (type === "dungeons") {
                node = staticNodes.campaignDungeons.find(
                  (node) => node.name === name,
                );
                if (node) {
                  return getID(node, "campaignDungeons");
                }
                node = staticNodes.sideQuestDungeons.find(
                  (node) => node.name === name,
                );
                if (node) {
                  return getID(node, "sideQuestDungeons");
                } else {
                  return null;
                }
              } else {
                return null;
              }
            }
            return getID(node, type as NODE_TYPE);
          })
          .filter(Boolean) as string[],
      ),
    ];
  } catch (error) {
    return [];
  }
}
export const useDiscoveredNodesStore = create(
  persist<{
    discoveredNodes: string[];
    toggleDiscoveredNode: (node: string) => void;
    setDiscoveredNodes: (discoveredNodes: string[]) => void;
  }>(
    (set) => ({
      discoveredNodes: [],
      toggleDiscoveredNode: (node) =>
        set((state) => {
          if (state.discoveredNodes.includes(node)) {
            return {
              discoveredNodes: state.discoveredNodes.filter((n) => n !== node),
            };
          } else {
            return { discoveredNodes: [...state.discoveredNodes, node] };
          }
        }),
      setDiscoveredNodes: (discoveredNodes) =>
        set({ discoveredNodes: filterDiscoveredNodes(discoveredNodes) }),
    }),
    {
      name: "discovered-nodes-storage",
      version: 1,
      migrate: (persistedState: any) => {
        return persistedState;
      },
      merge: (persistentState: any, currentState) => {
        if (persistentState?.discoveredNodes) {
          persistentState.discoveredNodes = filterDiscoveredNodes(
            persistentState.discoveredNodes,
          );
        }
        return { ...currentState, ...persistentState };
      },
    },
  ),
);

withStorageDOMEvents(useDiscoveredNodesStore);
