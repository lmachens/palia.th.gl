import { LatLngBoundsExpression } from "leaflet";

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
    transformation: [1 / 300, -100, 1 / 300, 400],
    view: [-34500, 110000] as [number, number],
    bounds: [
      [30000, 30000],
      [-110000, 180000],
    ] as LatLngBoundsExpression,
    minNativeZoom: 0,
    maxNativeZoom: 3,
  },
  fairgrounds: {
    transformation: [1 / 115, -450, 1 / 115, 10],
    view: [25000, 82000] as [number, number],
    bounds: [
      [50000, 50000],
      [0, 110000],
    ] as LatLngBoundsExpression,
    minNativeZoom: 0,
    maxNativeZoom: 3,
  },
  housing: {
    transformation: [1 / 240, 250, 1 / 240, 290],
    view: [-256, 256] as [number, number],
    bounds: [
      [50000, -59000],
      [-60000, 62000],
    ] as LatLngBoundsExpression,
    minNativeZoom: 0,
    maxNativeZoom: 3,
  },
};

export const DEFAULT_MAP = "kilima-valley";
export const isMap = (map: string) => Object.keys(CONFIGS).includes(map);
