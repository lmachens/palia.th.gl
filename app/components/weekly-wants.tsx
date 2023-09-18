/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { isOverwolfApp } from "../lib/env";
import { useWeeklyWantsStore } from "../lib/storage/weekly-wants";
import { villagers } from "../lib/villager";
import { getWeeklyWants } from "../lib/weekly-wants";
import { useDict } from "./(i18n)/i18n-provider";
import Popover from "./popover";

export default function WeeklyWants() {
  const dict = useDict();
  const params = useParams();
  const { data } = useSWR(
    "/api/events/recent",
    () => getWeeklyWants(params.lang as string),
    {}
  );
  const [targetPopover, setTargetPopover] = useState<null | string>(null);
  const weeklyWants = useWeeklyWantsStore();

  return (
    <>
      {Object.entries(villagers).map(([id, villager]) => {
        return (
          <Popover
            key={villager.name}
            open={targetPopover === villager.name}
            onOpenChange={(isOpen) => {
              if (isOpen) {
                setTargetPopover(villager.name);
              } else {
                setTargetPopover(null);
              }
            }}
            trigger={
              <button
                className={`text-gray-200 text-sm flex gap-1 text-shadow bg-black bg-opacity-50 md:rounded-full whitespace-nowrap mx-1 shrink-0 relative`}
              >
                <Image
                  src={villager.icon}
                  width={40}
                  height={40}
                  alt={villager.name}
                  title={villager.name}
                  draggable={false}
                  unoptimized={isOverwolfApp}
                />
                {data &&
                  weeklyWants.finished.filter(
                    (v) => v.villagerId === id && v.version === data.version
                  ).length >= 4 && (
                    <svg
                      className="absolute -right-1 top-0"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      strokeWidth="4"
                      stroke="#3de5af"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12l5 5l10 -10"></path>
                    </svg>
                  )}
              </button>
            }
          >
            <div className="flex flex-col flex-wrap gap-1 border rounded border-gray-600 bg-neutral-900 p-2">
              <h3 className="font-bold text-sky-400">{villager.name}</h3>
              <p className="italic">{dict.menu.weeklyWants}</p>

              {data ? (
                <>
                  {data.weeklyWants[id]?.map((item) => {
                    return (
                      <label key={item.name} className="flex gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={weeklyWants.finished.some(
                            (v) =>
                              v.id === item.id &&
                              v.villagerId === id &&
                              v.version === data.version
                          )}
                          onChange={() =>
                            weeklyWants.toggleFinished(
                              id,
                              item.id,
                              data.version
                            )
                          }
                        />
                        <span>
                          {item.name} {item.rewardLevel === "Love" ? "💕" : ""}
                        </span>
                      </label>
                    );
                  })}
                </>
              ) : (
                <div>...</div>
              )}
            </div>
          </Popover>
        );
      })}
    </>
  );
}
