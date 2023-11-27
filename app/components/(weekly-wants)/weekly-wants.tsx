"use client";
import { useGameInfoStore } from "@/app/lib/storage/game-info";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useDict } from "../(i18n)/i18n-provider";
import { isOverwolfApp } from "../../lib/env";
import { useWeeklyWantsStore } from "../../lib/storage/weekly-wants";
import { cn } from "../../lib/utils";
import { villagers } from "../../lib/villagers";
import type { WEEKLY_WANTS } from "../../lib/weekly-wants";
import Popover from "../popover";

export default function WeeklyWants({ data }: { data?: WEEKLY_WANTS }) {
  const dict = useDict();
  const [targetPopover, setTargetPopover] = useState<null | string>(null);
  const weeklyWants = useWeeklyWantsStore();

  const player = useGameInfoStore((state) => state.player);

  const progress = useMemo<Record<string, number[]>>(() => {
    if (!data) {
      return {};
    }
    // Disabled for preview release
    // if (player) {
    //   return player.giftHistory.reduce((acc, curr) => {
    //     if (curr.associatedPreferenceVersion === data.version) {
    //       const villagerId = curr.villagerCoreId;
    //       acc[villagerId] = acc[villagerId] || [];
    //       acc[villagerId].push(curr.itemPersistId);
    //     }
    //     return acc;
    //   }, {} as Record<string, number[]>);
    // }
    return weeklyWants.finished.reduce((acc, curr) => {
      if (curr.version === data.version) {
        const villagerId = curr.villagerPersistId;
        acc[villagerId] = acc[villagerId] || [];
        acc[villagerId].push(curr.id);
      }
      return acc;
    }, {} as Record<string, number[]>);
  }, [player?.giftHistory, weeklyWants.finished, data?.version]);

  return (
    <>
      <Popover
        open={!!targetPopover}
        forceMount
        onOpenChange={(isOpen) => {
          if (isOpen) {
            setTargetPopover("open");
          } else {
            setTargetPopover(null);
          }
        }}
        trigger={
          <button
            className={cn(
              "flex items-center gap-1  border border-white/10 px-2  hover:border-white/15 transition-colors",
              isOverwolfApp ? "rounded-none ml-1 py-0.5" : "rounded-md py-1",
              targetPopover ? "bg-brand/70" : "bg-brand/50 hover:bg-brand/60"
            )}
          >
            <svg
              className="shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 8m0 1a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1z" />
              <path d="M12 8l0 13" />
              <path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7" />
              <path d="M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5" />
            </svg>
            <span className="hidden md:block truncate">
              {dict.menu.weeklyWants}
            </span>
          </button>
        }
      >
        <div className="container max-w-lg w-[95vw] text-center space-y-2 border rounded border-gray-600 bg-neutral-900 p-2">
          <h2 className="uppercase tracking-wide text-sm text-white font-semibold">
            {dict.weeklyWants.subtitle}
          </h2>
          <p className="text-gray-300">{dict.weeklyWants.description}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {villagers.map((villager) => {
              return (
                <Popover
                  key={villager.name}
                  open={targetPopover === villager.name}
                  onOpenChange={(isOpen) => {
                    if (isOpen) {
                      setTargetPopover(villager.name);
                    } else {
                      setTargetPopover("open");
                    }
                  }}
                  trigger={
                    <button
                      className={`text-gray-200 text-sm text-shadow rounded-full border border-gray-600 hover:bg-zinc-800 whitespace-nowrap  flex items-center`}
                      aria-label={villager.name}
                    >
                      <div className="relative">
                        <Image
                          src={`/icons/Icons_Characters/${villager.icon}.webp`}
                          width={40}
                          height={40}
                          alt={villager.name}
                          title={villager.name}
                          draggable={false}
                          unoptimized={isOverwolfApp}
                        />
                        {progress[villager.persistId]?.length >= 4 && (
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
                            <path d="M5 12l5 5l10 -10" />
                          </svg>
                        )}
                      </div>
                      <span className="truncate px-2 mr-1">
                        {villager.name}
                      </span>
                    </button>
                  }
                >
                  <div className="flex flex-col flex-wrap gap-1 border rounded border-gray-600 bg-neutral-900 p-2">
                    <h3 className="font-bold text-sky-400">{villager.name}</h3>
                    <p className="italic">{dict.menu.weeklyWants}</p>
                    {data?.weeklyWants[villager.configId]?.map((item) => {
                      return (
                        <label key={item.name} className="flex gap-1 text-sm">
                          <input
                            type="checkbox"
                            checked={
                              progress[villager.persistId]?.includes(item.id) ??
                              false
                            }
                            onChange={() => {
                              if (isOverwolfApp) {
                                alert(
                                  "The weekly wants is automatically tracked in the app."
                                );
                              } else {
                                weeklyWants.toggleFinished(
                                  villager.persistId,
                                  item.id,
                                  data.version
                                );
                              }
                            }}
                          />
                          <span>
                            {item.name}{" "}
                            {item.rewardLevel === "Love" ? "💕" : ""}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </Popover>
              );
            })}
          </div>
          <p className="text-gray-300 text-sm">
            Last Update: {data && new Date(data.timestamp).toLocaleDateString()}
          </p>
        </div>
      </Popover>
    </>
  );
}
