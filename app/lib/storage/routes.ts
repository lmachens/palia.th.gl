import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ROUTE = {
  id: string;
  name: string;
  types: {
    type: string;
    count: number;
  }[];
  positions: {
    position: [number, number];
  }[][];
  texts?: {
    position: [number, number];
    text: string;
  }[];
};
const EMPTY_ROUTE: ROUTE = {
  id: "",
  name: "",
  types: [],
  positions: [],
  texts: [],
};
export const useRoutesStore = create(
  persist<{
    isCreating: boolean;
    setIsCreating: (isCreating: boolean) => void;
    tempRoute: ROUTE;
    updateTempRoute: (tempRoute: Partial<ROUTE>) => void;
    resetTempRoute: () => void;
    routes: ROUTE[];
    addRoute: (route: ROUTE) => void;
    removeRoute: (routeId: string) => void;
    editRoute: (routeId: string, updatedRoute: Partial<ROUTE>) => void;
    activeRoutes: string[];
    addActiveRoute: (routeId: string) => void;
    removeActiveRoute: (routeId: string) => void;
  }>(
    (set) => ({
      isCreating: false,
      setIsCreating: (isCreating) => set({ isCreating }),
      tempRoute: EMPTY_ROUTE,
      updateTempRoute: (tempRoute) =>
        set((state) => ({ tempRoute: { ...state.tempRoute, ...tempRoute } })),
      resetTempRoute: () => set({ tempRoute: EMPTY_ROUTE }),
      routes: [],
      addRoute: (route) =>
        set((state) => ({
          routes: [...state.routes, route],
          activeRoutes: [...state.activeRoutes, route.id],
        })),
      removeRoute: (routeId) =>
        set((state) => ({
          routes: state.routes.filter((route) => route.id !== routeId),
          activeRoutes: state.activeRoutes.filter((id) => id !== routeId),
        })),
      editRoute: (routeId, updatedRoute) =>
        set((state) => ({
          routes: state.routes.map((route) => {
            if (route.id === routeId) {
              return { ...route, ...updatedRoute };
            }
            return route;
          }),
        })),
      activeRoutes: [],
      addActiveRoute: (routeId) =>
        set((state) => ({
          activeRoutes: [...state.activeRoutes, routeId],
        })),
      removeActiveRoute: (routeId) =>
        set((state) => ({
          activeRoutes: state.activeRoutes.filter((id) => id !== routeId),
        })),
    }),
    {
      name: "routes-storage",
    }
  )
);
