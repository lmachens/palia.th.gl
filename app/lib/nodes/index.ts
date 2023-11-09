import { area } from "./area";
import { housingPlot } from "./housingPlot";
import { landmark } from "./landmark";
import { location } from "./location";
import { spawnNodes } from "./spawn-nodes";
import { stable } from "./stable";
import { wardrobe } from "./wardrobe";

import { zone } from "./zone";

export { spawnNodes };
export const staticNodes = {
  area: area,
  landmark: landmark,
  location: location,
  stable: stable,
  housingPlot: housingPlot,
  zone: zone,
  wardrobe: wardrobe,
  villager: {},
} as const;

export type NODE = {
  id: string;
  x: number;
  y: number;
  type: string;
  mapName: string;
  isSpawnNode?: boolean;
  isStar?: boolean;
};

export const staticNodesWithType: NODE[] = Object.entries(staticNodes).flatMap(
  ([_type, map]) => {
    const type = _type as keyof typeof staticNodes;
    return Object.entries(map).flatMap(([id, more]) =>
      Object.entries(more).flatMap(([key, nodes]) => {
        return nodes.map(([x, y]) => ({
          id,
          x,
          y,
          type,
          mapName: key,
        }));
      })
    );
  }
);
export const spawnNodesWithType: NODE[] = Object.entries(spawnNodes).flatMap(
  ([_type, map]) => {
    const type = _type as keyof typeof spawnNodes;
    return Object.entries(map).flatMap(([key, nodes]) => {
      return nodes.map(([x, y]) => ({
        id: type + "@" + x + "," + y,
        x,
        y,
        type,
        isSpawnNode: true,
        mapName: key,
      }));
    });
  }
);

export const nodes: NODE[] = [
  ...staticNodesWithType,
  ...spawnNodesWithType,
].reverse();

export const ALL_FILTERS = [
  ...Object.keys(staticNodes),
  ...Object.keys(spawnNodes),
];
