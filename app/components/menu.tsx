"use client";
import Cookies from "js-cookie";
import { isOverwolfApp } from "../lib/env";
import { useAccountStore } from "../lib/storage/account";
import { useGameInfoStore } from "../lib/storage/game-info";
import { useGlobalSettingsStore } from "../lib/storage/global-settings";
import { useSettingsStore } from "../lib/storage/settings";
import { useDict } from "./(i18n)/i18n-provider";
import Drawer from "./drawer";
import ExternalLink from "./external-link";
import LocaleSelect from "./locale-select";
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
export default function Menu({
  top,
  afterPatreon,
  beforeSettings,
}: {
  top?: React.ReactNode;
  afterPatreon?: React.ReactNode;
  beforeSettings?: React.ReactNode;
}) {
  const globalSettingsStore = useGlobalSettingsStore();
  const accountStore = useAccountStore();
  const dict = useDict();
  const lockedWindow = useSettingsStore((state) => state.lockedWindow);
  const isOverlay = useGameInfoStore((state) => state.isOverlay);

  return (
    <Drawer
      show={(!lockedWindow || !isOverlay) && globalSettingsStore.showSidebar}
      aria-label="Main menu"
    >
      <div className="flex flex-col text-gray-300 h-full">
        <header className="p-2 my-2 flex justify-between">
          <div className="flex gap-2 items-center">
            <h1 className="text-xl font-bold">{dict.meta.subtitle}</h1>
            <LocaleSelect />
          </div>
          <button
            onClick={globalSettingsStore.toggleShowSidebar}
            type="button"
            aria-haspopup="menu"
            aria-label="Close sidebar"
            aria-expanded={globalSettingsStore.showSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-400"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M18 6l-12 12"></path>
              <path d="M6 6l12 12"></path>
            </svg>
          </button>
        </header>
        {top}
        <div
          className={`p-2 overflow-auto grow flex flex-col gap-2 ${
            isOverwolfApp ? "mb-[30px]" : ""
          }`}
        >
          {!accountStore.isPatron && (
            <>
              <p className="italic text-md text-center">
                {dict.menu.patronInfo}
              </p>
              <a
                href="https://www.th.gl/support-me"
                target="_blank"
                className="my-1 p-2 text-center uppercase text-white bg-[#ff424d] hover:bg-[#ca0f25]"
              >
                {dict.menu.becomePatron}
              </a>
            </>
          )}
          {afterPatreon}
          <h2 className="category-title">{dict.menu.settings}</h2>
          {beforeSettings}
          <Settings />
          <h2 className="category-title">{dict.menu.apps}</h2>
          <ExternalLink
            href="https://www.overwolf.com/app/Leon_Machens-Diablo_4_Map"
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
          {accountStore.isPatron && (
            <button
              onClick={() => {
                accountStore.setIsPatron(false);
                Cookies.remove("userId");
              }}
              className="my-1 p-2 uppercase text-white bg-[#ff424d] hover:bg-[#ca0f25]"
            >
              {dict.menu.disconnectPatreon}
            </button>
          )}
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
      </div>
    </Drawer>
  );
}
