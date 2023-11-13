import { create } from "zustand";
import type { NODE } from "../nodes";

export type CurrentGiftPreferences = {
  preferenceResetTime: {
    dayOfWeek: number;
    hour: number;
    minute: number;
  };
  preferenceDataVersionNumber: number;
  currentPreferenceData: Array<{
    villagerCoreId: number;
    currentGiftPreferences: Array<number>;
  }>;
};

export type ActorBase = {
  address: number;
  className: string;
  x: number;
  y: number;
  z: number;
};
export type ActorValeriaCharacter = {
  address: number;
  className: string;
  x: number;
  y: number;
  z: number;
  r: number;
  name: string;
  guid: string;
  giftHistory: VillagerGiftHistory[];
  skillLevels: SkillLevels[];
};

export type Actor = ActorBase | ActorValeriaCharacter;

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

export type ValeriaCharacter = {
  name: string;
  guid: string;
  giftHistory: VillagerGiftHistory[];
  skillLevels: SkillLevels[];
} & GameActor;

export type VillagerGiftHistory = {
  villagerCoreId: number;
  itemPersistId: number;
  lastGiftedMs: number;
  associatedPreferenceVersion: number;
};

export type SkillLevels = {
  type: string;
  level: number;
  xpGainedThisLevel: number;
};

export const useGameInfoStore = create<{
  isOverlay: boolean;
  setIsOverlay: (isOverlay: boolean) => void;
  player: GameActor | null;
  setPlayer: (player: GameActor) => void;
  villagers: GameActor[];
  setVillagers: (villagers: GameActor[]) => void;
  otherPlayers: ValeriaCharacter[];
  setOtherPlayers: (villagers: ValeriaCharacter[]) => void;
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
