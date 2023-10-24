"use client";
import Image from "next/image";
import Script from "next/script";
import { useState } from "react";
import { isOverwolfApp } from "../lib/env";
import { useWeeklyWantsStore } from "../lib/storage/weekly-wants";
import { villagers } from "../lib/villager";
import type { WEEKLY_WANTS } from "../lib/weekly-wants";
import { useDict } from "./(i18n)/i18n-provider";
import ExternalLink from "./external-link";
import Popover from "./popover";

export default function WeeklyWants({ data }: { data?: WEEKLY_WANTS }) {
  const dict = useDict();
  const [targetPopover, setTargetPopover] = useState<null | string>(null);
  const weeklyWants = useWeeklyWantsStore();
  return (
    <>
      <Script src="https://paliapedia.com/embed.js" async />
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
                aria-label={villager.name}
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
                {weeklyWants.finished.filter(
                  (v) => v.villagerId === id && v.version === data?.version
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
              {data?.weeklyWants[id]?.map((item) => {
                return (
                  <ExternalLink
                    key={item.name}
                    href={`https://paliapedia.com/item/${item.item}`}
                    text={
                      <label className="flex gap-1 text-sm">
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
                    }
                  />
                );
              })}
            </div>
          </Popover>
        );
      })}
    </>
  );
}
