import { area } from "./area";
import { housingPlot } from "./housingPlot";
import { landmark } from "./landmark";
import { location } from "./location";
import { recipe } from "./recipe";
import { stable } from "./stable";
import { sundropLillies } from "./sundropLillies";
import { wildGarlic } from "./wildGarlic";
import { zone } from "./zone";

export const spawnNodes = {
  sundropLillies: sundropLillies,
  wildGarlic: wildGarlic,
} as const;

export const staticNodes = {
  area: area,
  landmark: landmark,
  location: location,
  stable: stable,
  housingPlot: housingPlot,
  recipe: recipe,
  zone: zone,
} as const;

export type NODE_TYPE = keyof typeof staticNodes | keyof typeof spawnNodes;
export type SIMPLE_NODE = (typeof spawnNodes &
  typeof staticNodes)[NODE_TYPE][number];
export type NODE = SIMPLE_NODE & { id: string; type: NODE_TYPE, isSpawnNode?: boolean };

export const nodes: NODE[] = [];
Object.keys(staticNodes).forEach((_type) => {
  const type = _type as keyof typeof staticNodes;
  staticNodes[type].forEach((node) => {
    nodes.push({ ...node, type });
  });
});
Object.keys(spawnNodes).forEach((_type) => {
  const type = _type as keyof typeof spawnNodes;
  spawnNodes[type].forEach((node) => {
    nodes.push({ ...node, type, id: type + "@" + node.x + "," + node.y, isSpawnNode: true });
  });
});

nodes.reverse();
