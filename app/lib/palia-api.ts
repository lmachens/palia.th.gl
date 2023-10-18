import type {
  Actor,
  CurrentGiftPreferences,
} from "../(overwolf)/components/player";

export async function sendWeeklyWantsToPaliaAPI(
  currentGiftPreferences: CurrentGiftPreferences
) {
  try {
    await fetch("https://palia-api.th.gl/weekly-wants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      },
      body: JSON.stringify(actors),
    });
  } catch (e) {
    //
  }
}
