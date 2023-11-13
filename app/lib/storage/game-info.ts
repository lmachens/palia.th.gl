import type { CurrentGiftPreferences } from "@/app/(overwolf)/components/player";
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

export type OtherPlayerGameActor = {
  name: string;
  guid: string;
} & GameActor;

export const useGameInfoStore = create<{
  isOverlay: boolean;
  setIsOverlay: (isOverlay: boolean) => void;
  player: GameActor | null;
  setPlayer: (player: GameActor) => void;
  villagers: GameActor[];
  setVillagers: (villagers: GameActor[]) => void;
  otherPlayers: OtherPlayerGameActor[];
  setOtherPlayers: (villagers: OtherPlayerGameActor[]) => void;
  spawnNodes: NODE[];
  setSpawnNodes: (spawnNodes: NODE[]) => void;
  currentGiftPreferences: CurrentGiftPreferences | null;
  setCurrentGiftPreferences: (
    currentGiftPreferences: CurrentGiftPreferences
  ) => void;
}>((set) => ({
  isOverlay: false,
  setIsOverlay: (isOverlay) => set({ isOverlay }),
  player: null,
  setPlayer: (player) => set({ player }),
  villagers: [],
  setVillagers: (villagers) => set({ villagers }),
  otherPlayers: [],
  setOtherPlayers: (otherPlayers) => set({ otherPlayers }),
  spawnNodes: [],
  setSpawnNodes: (spawnNodes) => set({ spawnNodes }),
  currentGiftPreferences: null,
  setCurrentGiftPreferences: (currentGiftPreferences) =>
    set({ currentGiftPreferences }),
}));
