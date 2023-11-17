"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Script from "next/script";
import { useState } from "react";
import { useDict, useI18N } from "../(i18n)/i18n-provider";
import { isOverwolfApp } from "../../lib/env";
import { DEFAULT_LOCALE } from "../../lib/i18n";
import { useWeeklyWantsStore } from "../../lib/storage/weekly-wants";
import { cn } from "../../lib/utils";
import { villagers } from "../../lib/villager";
import type { WEEKLY_WANTS } from "../../lib/weekly-wants";
import ExternalLink from "../external-link";
import Popover from "../popover";

const Checkbox = dynamic(() => import("./checkbox"), { ssr: false });
const Finished = dynamic(() => import("./finished"), { ssr: false });

export default function WeeklyWants({ data }: { data?: WEEKLY_WANTS }) {
  const i18n = useI18N();
  const dict = useDict();
  const [targetPopover, setTargetPopover] = useState<null | string>(null);
  const weeklyWants = useWeeklyWantsStore();

  return (
    <>
      <Script src="https://paliapedia.com/embed.js" async />
      <Popover
        open={!!targetPopover}
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
        <div className="container max-w-[95vw] text-center space-y-2 border rounded border-gray-600 bg-neutral-900 p-2">
          <h2 className="uppercase tracking-wide text-sm text-white font-semibold">
            {dict.weeklyWants.subtitle}
          </h2>
          <p className="text-gray-300">{dict.weeklyWants.description}</p>
          <div className="flex flex-wrap gap-1 justify-center">
            {Object.entries(villagers).map(([id, villager]) => {
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
                      className={`text-gray-200 text-sm flex gap-1 text-shadow md:rounded-full whitespace-nowrap mx-1 shrink-0 relative`}
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
                        (v) =>
                          v.villagerId === id && v.version === data?.version
                      ).length >= 4 && <Finished />}
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
                          href={`https://paliapedia.com/${
                            i18n.locale === DEFAULT_LOCALE
                              ? ""
                              : `${i18n.locale}/`
                          }item/${item.item}`}
                          text={
                            <label className="flex gap-1 text-sm">
                              <Checkbox
                                itemId={item.id}
                                villagerId={id}
                                version={data.version}
                              />
                              <span>
                                {item.name}{" "}
                                {item.rewardLevel === "Love" ? "💕" : ""}
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
          </div>
        </div>
      </Popover>
    </>
  );
}
