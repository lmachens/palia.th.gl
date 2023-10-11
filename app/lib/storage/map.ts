import type leaflet from "leaflet";
import { create } from "zustand";

export const useMapStore = create<{
  map: leaflet.Map | null;
  mapName: string;
  setMap: (map: leaflet.Map | null, mapName?: string) => void;
}>((set) => ({
  map: null,
  mapName: "kilima-valley",
  setMap: (map, mapName) => set({ map, mapName }),
}));

export function useMap() {
  const map = useMapStore((store) => store.map)!;
  return map;
}
