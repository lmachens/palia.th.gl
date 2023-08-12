"use client";

import { RECENT_EVENTS } from "../lib/events";
import { chestT3 } from "../lib/nodes/chestT3";
import { useGlobalSettingsStore } from "../lib/storage/global-settings";
import { useDict } from "./(i18n)/i18n-provider";
import { useMap } from "./(map)/map";

const EVENT_INTERVAL_MINUTES = 2 * 60 + 15;
const EVENT_DURATION_MINUTES = 60;
const CALIBRATION_START_TIME = Date.UTC(1970, 1, 1, 9, 59, 0);

function calculateTimeLeft(time: number) {
  const elapsedTimeMinutes = Math.floor(
    (time - CALIBRATION_START_TIME) / (1000 * 60)
  );

  const nextEventTimeMinutes =
    Math.ceil(elapsedTimeMinutes / EVENT_INTERVAL_MINUTES) *
    EVENT_INTERVAL_MINUTES;
  let timeLeftMinutes = nextEventTimeMinutes - elapsedTimeMinutes;
  const eventTimeLeftMinutes =
    EVENT_DURATION_MINUTES - (EVENT_INTERVAL_MINUTES - timeLeftMinutes);
  const isActive = eventTimeLeftMinutes > 0;
  if (isActive) {
    timeLeftMinutes = eventTimeLeftMinutes;
  }
  const hoursLeft = Math.floor(timeLeftMinutes / 60)
    .toFixed(0)
    .padStart(2, "0");
  const minutesLeft = (timeLeftMinutes % 60).toFixed(0).padStart(2, "0");
  const secondsLeft = (60 - ((time / 1000) % 60)).toFixed(0).padStart(2, "0");

  return {
    isActive,
    value: `${hoursLeft}:${minutesLeft}:${secondsLeft}`,
  };
}

export default function Helltide({
  onRefreshRecentEvents,
  time,
}: {
  onRefreshRecentEvents: () => Promise<RECENT_EVENTS | undefined>;
  time: number;
}) {
  const dict = useDict();
  const map = useMap();
  const stackTimers = useGlobalSettingsStore((state) => state.stackTimers);

  const timeLeft = calculateTimeLeft(time);

  const onClick = async () => {
    const recentEvents = await onRefreshRecentEvents();
    if (!recentEvents) {
      return;
    }
    const chestBounds = chestT3
      .filter(
        (chest) => chest.zone.toLowerCase() === recentEvents.helltide.zone
      )
      .map((event) => [event.x, event.y] as [number, number]);
    map.flyToBounds(chestBounds);
  };

  return timeLeft.isActive ? (
    <button
      className={`pointer-events-auto text-white text-sm px-2.5 py-1.5 flex gap-1 ${
        stackTimers ? "flex-row-reverse" : ""
      } md:rounded-lg whitespace-nowrap bg-gradient-to-r from-orange-500 to-pink-600 hover:from-pink-600 hover:to-orange-500`}
      onClick={onClick}
    >
      <span className="uppercase">{dict.helltide.inProgress}</span>
      <span className="font-mono">{timeLeft.value}</span>
    </button>
  ) : (
    <div
      className={`text-gray-200 text-sm px-2.5 py-1.5 flex gap-1 ${
        stackTimers ? "flex-row-reverse" : ""
      } text-shadow bg-black bg-opacity-50 md:rounded-lg whitespace-nowrap`}
    >
      <span className="text-orange-400 uppercase">
        {dict.helltide.startsIn}
      </span>
      <span className="font-mono">{timeLeft.value}</span>
    </div>
  );
}
