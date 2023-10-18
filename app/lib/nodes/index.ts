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
} as const;

export type NODE_TYPE = keyof typeof staticNodes | keyof typeof spawnNodes;
export type SIMPLE_NODE = (typeof spawnNodes &
  typeof staticNodes)[NODE_TYPE][number];
export type NODE = SIMPLE_NODE & {
  id: string;
  type: NODE_TYPE;
  isSpawnNode?: boolean;
  isStar?: boolean;
};

export const staticNodesWithType: NODE[] = Object.keys(staticNodes).flatMap(
  (_type) => {
    const type = _type as keyof typeof staticNodes;
    return staticNodes[type].map((node) => {
      return { ...node, type };
    });
  }
);
export const spawnNodesWithType: NODE[] = Object.keys(spawnNodes).flatMap(
  (_type) => {
    const type = _type as keyof typeof spawnNodes;
    return spawnNodes[type].map((node) => {
      return {
        ...node,
        type,
        id: type + "@" + node.x + "," + node.y,
        isSpawnNode: true,
      };
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
