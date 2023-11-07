import type {
  Actor,
  CurrentGiftPreferences,
} from "../(overwolf)/components/player";

let version = "";
overwolf.extensions.current.getManifest((manifest) => {
  version = manifest.meta.version;
});

export async function sendWeeklyWantsToPaliaAPI(
  currentGiftPreferences: CurrentGiftPreferences
) {
  try {
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
