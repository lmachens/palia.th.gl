import { promisifyOverwolf } from "../(overwolf)/lib/wrapper";
import type { NODE } from "./nodes";
import type { Actor, CurrentGiftPreferences } from "./storage/game-info";
import { villagers } from "./villagers";

export async function getVillagers() {
  const response = await fetch("https://palia-api.th.gl/nodes?type=villagers");
  const result = (await response.json()) as {
    [type: string]: {
      mapName: string;
      position: [number, number, number];
      timestamp: number;
    };
  };
  const nodes = Object.entries(result).map(([type, { mapName, position }]) => {
    if (!villagers.find((villager) => villager.className === type)) {
      console.warn(`Unknown villager type: ${type}`);
    }
    const node: NODE = {
      id: type,
      type: "villager",
      x: position[0],
      y: position[1],
      mapName,
    };
    return node;
  });
  return nodes;
}

export async function sendWeeklyWantsToPaliaAPI(
  currentGiftPreferences: CurrentGiftPreferences
) {
  try {
    const manifest = await promisifyOverwolf(
      overwolf.extensions.current.getManifest
    )();
    const version = manifest.meta.version;
    await fetch("https://palia-api.th.gl/weekly-wants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "App-Version": version,
      },
      body: JSON.stringify(currentGiftPreferences),
    });
  } catch (e) {
    //
  }
}

let lastSend = 0;
export async function sendActorsToPaliaAPI(actors: Actor[]) {
  if (Date.now() - lastSend < 30000) {
    return;
  }
  lastSend = Date.now();
  try {
    const manifest = await promisifyOverwolf(
      overwolf.extensions.current.getManifest
    )();
    const version = manifest.meta.version;

    await fetch("https://palia-api.th.gl/nodes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "App-Version": version,
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      body: JSON.stringify(actors.map(({ address, ...actor }) => actor)),
    });
  } catch (e) {
    //
  }
}
