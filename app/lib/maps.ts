export const MAPS = ["kilima-valley", "bahari-bay"];
export const TRANSFORMATIONS = {
  "kilima-valley": [1 / 240, 250, 1 / 240, 290],
  "bahari-bay": [1 / 300, -100, 1 / 300, 400],
};
export const VIEWS = {
  "kilima-valley": [-256, 256] as [number, number],
  "bahari-bay": [-34500, 110000] as [number, number],
};
export const DEFAULT_MAP = "kilima-valley";
export const isMap = (map: string) => MAPS.includes(map);
