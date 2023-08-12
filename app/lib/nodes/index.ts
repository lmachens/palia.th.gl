import { additionalMonsters } from "./additionalMonsters";
import { alchemists } from "./alchemists";
import { altars } from "./altars";
import { campaignDungeons } from "./campaignDungeons";
import { campaignQuests } from "./campaignQuests";
import { cellars } from "./cellars";
import { chestAny } from "./chestAny";
import { chestT1 } from "./chestT1";
import { chestT2 } from "./chestT2";
import { chestT3 } from "./chestT3";
import { dungeons } from "./dungeons";
import { events } from "./events";
import { harbinger } from "./harbinger";
import { healers } from "./healers";
import { highValueTarget } from "./highValueTarget";
import { jewelers } from "./jewelers";
import { banditMonsters } from "./monsters_bandit";
import { cannibalMonsters } from "./monsters_cannibal";
import { cultistMonsters } from "./monsters_cultist";
import { demonMonsters } from "./monsters_demon";
import { drownMonsters } from "./monsters_drown";
import { fallenMonsters } from "./monsters_fallen";
import { ghostMonsters } from "./monsters_ghost";
import { goatmanMonsters } from "./monsters_goatman";
import { knightMonsters } from "./monsters_knight";
import { skeletonMonsters } from "./monsters_skeleton";
import { snakeMonsters } from "./monsters_snake";
import { spiderMonsters } from "./monsters_spider";
import { vampireMonsters } from "./monsters_vampire";
import { werewolfMonsters } from "./monsters_werewolf";
import { wildlifeMonsters } from "./monsters_wildlife";
import { zombieMonsters } from "./monsters_zombie";
import { occultists } from "./occultists";
import { sideQuestDungeons } from "./sideQuestDungeons";
import { sideQuests } from "./sideQuests";
import { stableMasters } from "./stableMasters";
import { strongholds } from "./strongholds";
import { waypoints } from "./waypoints";

export const spawnNodes = {
  chestsAny: chestAny,
  chestsT1: chestT1,
  chestsT2: chestT2,
  chestsT3: chestT3,
  harbingers: harbinger,
  highValueTargets: highValueTarget,
  banditMonsters,
  cannibalMonsters,
  cultistMonsters,
  demonMonsters,
  drownMonsters,
  fallenMonsters,
  ghostMonsters,
  goatmanMonsters,
  knightMonsters,
  skeletonMonsters,
  snakeMonsters,
  spiderMonsters,
  vampireMonsters,
  werewolfMonsters,
  wildlifeMonsters,
  zombieMonsters,
  additionalMonsters,
} as const;

export const staticNodes = {
  alchemists,
  altars,
  cellars,
  dungeons,
  campaignDungeons,
  sideQuestDungeons,
  healers,
  jewelers,
  occultists,
  stableMasters,
  waypoints,
  campaignQuests,
  sideQuests,
  events,
  strongholds,
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
