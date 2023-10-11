import type { LatLngBoundsExpression } from "leaflet";

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

const mapBounds = {
  fairgrounds: {
    topLeft: {
      x: 70000,
      y: 15000,
    },
    bottomRight: {
      x: 92000,
      y: 46000,
    },
  },
  "kilima-valley": {
    topLeft: {
      x: -54000,
      y: -44000,
    },
    bottomRight: {
      x: 56000,
      y: 46000,
    },
  },
  "bahari-bay": {
    topLeft: {
      x: 31138.41368584759,
      y: -130401.24416796268,
    },
    bottomRight: {
      x: 191947.1228615863,
      y: 30407.46500777605,
    },
  },
  housing: {
    topLeft: {
      x: -400000,
      y: -4000000,
    },
    bottomRight: {
      x: 700000,
      y: -10000,
    },
  },
} as const;

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

export function getMapFromCoords(coords: { x: number; y: number }) {
  for (const mapName in mapBounds) {
    const bounds = mapBounds[mapName as keyof typeof mapBounds];
    if (
      coords.x >= bounds.topLeft.x &&
      coords.x <= bounds.bottomRight.x &&
      coords.y >= bounds.topLeft.y &&
      coords.y <= bounds.bottomRight.y
    ) {
      return mapName;
    }
  }
  return null; // Coordinates do not belong to any known map
}
