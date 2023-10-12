import { create } from "zustand";
import type { NODE } from "../nodes";

export type GameActor = {
  className: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: number;
  mapName: string | null;
};

export const useGameInfoStore = create<{
  isOverlay: boolean;
  setIsOverlay: (isOverlay: boolean) => void;
  player: GameActor | null;
  setPlayer: (player: GameActor) => void;
  villagers: GameActor[];
  setVillagers: (villagers: GameActor[]) => void;
  spawnNodes: NODE[];
  setSpawnNodes: (spawnNodes: NODE[]) => void;
}>((set) => ({
  isOverlay: false,
  setIsOverlay: (isOverlay) => set({ isOverlay }),
  player: null,
  setPlayer: (player) => set({ player }),
  villagers: [],
  setVillagers: (villagers) => set({ villagers }),
  spawnNodes: [],
  setSpawnNodes: (spawnNodes) => set({ spawnNodes }),
}));
