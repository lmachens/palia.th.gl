import { copper } from "./copper";
import { recipe } from "./recipe";

export const spawnNodes = {
  copper: copper,
} as const;

export const staticNodes = {
  recipe: recipe,
} as const;

export type NODE_TYPE = keyof typeof staticNodes | keyof typeof spawnNodes;
export type SIMPLE_NODE = (typeof spawnNodes &
  typeof staticNodes)[NODE_TYPE][number];
export type NODE = SIMPLE_NODE & { id: string; type: NODE_TYPE };

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
    nodes.push({ ...node, type });
  });
});

nodes.reverse();
