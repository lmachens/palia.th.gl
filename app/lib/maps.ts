import type { LatLngBoundsExpression } from "leaflet";
import type { Actor } from "../(overwolf)/components/player";

export const CONFIGS = {
  "kilima-valley": {
    transformation: [1 / 240, 250, 1 / 240, 290],
    view: [-256, 256] as [number, number],
    bounds: [
      [50000, -59000],
      [-60000, 62000],
    ] as LatLngBoundsExpression,
    minNativeZoom: 0,
    maxNativeZoom: 3,
  },
  "bahari-bay": {
    transformation: [1 / 314, -100, 1 / 314, 413],
    view: [-46500, 100000] as [number, number],
    bounds: [
      [30000, 30000],
      [-110000, 180000],
    ] as LatLngBoundsExpression,
    minNativeZoom: 0,
    maxNativeZoom: 3,
  },
  fairgrounds: {
    transformation: [1 / 112, -470, 1 / 112, 0],
    view: [25000, 82000] as [number, number],
    bounds: [
      [50000, 50000],
      [0, 110000],
    ] as LatLngBoundsExpression,
    minNativeZoom: 0,
    maxNativeZoom: 3,
  },
  housing: {
    transformation: [1 / 142, -148, 1 / 142, 58],
    view: [30000, 53000] as [number, number],
    bounds: [
      [65000, 21000],
      [-10000, 94000],
    ] as LatLngBoundsExpression,
    minNativeZoom: 0,
    maxNativeZoom: 3,
  },
};

export const DEFAULT_MAP = "kilima-valley";
export const isMap = (map: string) => Object.keys(CONFIGS).includes(map);

const HOUSING_MOD = 65000;
export function modHousingCoords(coords: {
  x: number;
  y: number;
  z: number;
  r: number;
}) {
  let x = coords.x % HOUSING_MOD;
  if (x < 0) {
    x += HOUSING_MOD;
  }
  let y = coords.y % HOUSING_MOD;
  if (y < 0) {
    y += HOUSING_MOD;
  }
  return { x, y, z: coords.z };
}

export function getMapFromActor(actor: Actor) {
  if (actor.className.includes("Maps/Village")) {
    return "kilima-valley";
  }
  if (actor.className.includes("Maps/AZ1")) {
    return "bahari-bay";
  }
  if (actor.className.includes("Maps/HousingMaps")) {
    return "housing";
  }

  return null; // Coordinates do not belong to any known map
}
