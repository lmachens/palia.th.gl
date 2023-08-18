import { create } from "zustand";

export const useGameInfoStore = create<{
  isOverlay: boolean;
  setIsOverlay: (isOverlay: boolean) => void;
  player: {
    position: {
      x: number;
      y: number;
      z: number;
    };
    rotation: number;
    map: string;
  } | null;
  setPlayer: (player: {
    position: {
      x: number;
      y: number;
      z: number;
    };
    rotation: number;
    map: string;
  }) => void;
}>((set) => ({
  isOverlay: false,
  setIsOverlay: (isOverlay) => set({ isOverlay }),
  player: null,
  setPlayer: (player) => set({ player }),
}));
