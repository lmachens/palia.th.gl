import { create } from "zustand";

type Actor = {
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
  player: Actor | null;
  setPlayer: (player: Actor) => void;
  villagers: Actor[];
  setVillagers: (villagers: Actor[]) => void;
}>((set) => ({
  isOverlay: false,
  setIsOverlay: (isOverlay) => set({ isOverlay }),
  player: null,
  setPlayer: (player) => set({ player }),
  villagers: [],
  setVillagers: (villagers) => set({ villagers }),
}));
