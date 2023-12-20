"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { isOverwolfApp } from "@/lib/env";
import type { DICT } from "@/lib/i18n";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Brand from "./brand";
import ExternalLink from "./external-link";
import PatreonStatus from "./patreon-status";
import Settings from "./settings";

const DiscordIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 256 199"
      width="100%"
      height="100%"
      color="#ced4da"
      className={className}
    >
      <path
        fill="white"
        d="M216.856 16.597A208.5 208.5 0 00164.042 0c-2.275 4.113-4.933 9.646-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.807 207.807 0 00-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.13 161.13 0 0079.735 175.3a136.374 136.374 0 01-21.846-10.632 108.542 108.542 0 005.356-4.237c42.122 19.702 87.89 19.702 129.51 0 1.751 1.46 3.543 2.88 5.355 4.237a136.011 136.011 0 01-21.886 10.653c4.006 8.02 8.638 15.671 13.873 22.848 21.142-6.581 42.646-16.637 64.815-33.213 5.316-56.288-9.081-105.09-38.056-148.36zM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18z"
      />
    </svg>
  );
};

const DISCOVER_LINKS = [
  {
    href: "https://paliapedia.com/?ref=palia.th.gl",
    text: "Palia Database",
  },
  {
    href: "https://www.paliatracker.com/?ref=palia.th.gl",
    text: "Palia Gift Tracker",
  },
  {
    href: "https://palia-garden-planner.vercel.app/?ref=palia.th.gl",
    text: "Palia Garden Planner",
  },
  {
    href: "https://paliaplanner.com/?ref=palia.th.gl",
    text: "Palia Planner",
  },
  {
    href: "https://paliammo.de/?ref=palia.th.gl",
    text: "Palia MMO - German Fansite",
  },
  {
    href: "https://discord.gg/YpxRRQmD",
    text: "Phoenix Rise - Community Events",
  },
  {
    href: "https://camillesimon.github.io/PaliaTracker/?ref=palia.th.gl",
    text: "Palia Tracker",
  },
  {
    href: "https://www.th.gl/?ref=palia.th.gl",
    text: "Gaming Apps & Tools",
  },
];

export default function GlobalMenu({
  top,
  afterPatreon,
  beforeSettings,
  dict,
}: {
  top?: React.ReactNode;
  afterPatreon?: React.ReactNode;
  beforeSettings?: React.ReactNode;
  dict: DICT;
}) {
  return (
    <Sheet modal={false}>
      <SheetTrigger className="border rounded-md p-2 hover:bg-white/20 transition-colors">
        <HamburgerMenuIcon />
      </SheetTrigger>
      <SheetContent forceMount>
        <SheetHeader>
          <SheetTitle>
            <Brand />
          </SheetTitle>
        </SheetHeader>
        {top}
        <div
          className={`overflow-auto pr-1 grow flex flex-col gap-2 ${
            isOverwolfApp ? "mb-[30px]" : ""
          }`}
          onDoubleClick={(event) => event.stopPropagation()}
        >
          <SheetDescription>{dict.meta.description}</SheetDescription>
          <PatreonStatus />
          {afterPatreon}
          <ExternalLink
            href="https://www.th.gl/apps/Palia%20Map/release-notes"
            text="Release Notes"
          />
          <h2 className="category-title">{dict.menu.settings}</h2>
          {beforeSettings}
          <Settings />
          <h2 className="category-title">{dict.menu.apps}</h2>
          <ExternalLink
            href="https://www.overwolf.com/app/Leon_Machens-Palia_Map"
            text="Desktop App on Overwolf"
          />
          <h2 className="category-title">{dict.menu.community}</h2>
          <ExternalLink
            href="https://discord.com/invite/NTZu8Px"
            text={
              <>
                <DiscordIcon className="inline-block w-4 h-4 mr-1" />
                <span>Discord</span>
              </>
            }
            aria-label="Discord"
          />

          <h2 className="category-title">{dict.menu.discover}</h2>
          {DISCOVER_LINKS.map(({ href, text }) => (
            <ExternalLink key={href} href={href} text={text} />
          ))}
          <h2 className="category-title">{dict.menu.contribute}</h2>
          <ExternalLink
            href="https://github.com/lmachens/palia.th.gl"
            text="GitHub"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
