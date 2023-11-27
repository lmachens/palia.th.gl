import Link from "next/link";
import type { DICT } from "../lib/i18n";
import { DEFAULT_MAP } from "../lib/maps";
import { cn } from "../lib/utils";
import AppDownload from "./app-download";

export default function WebHeader({
  dict,
  lang,
  page,
  children,
}: {
  dict: DICT;
  lang: string;
  page: string;
  children?: React.ReactNode;
}) {
  const isDownloadPage = page === "download";
  const isLeaderboardPage = page === "leaderboard";
  const isRummagePilePage = page === "rummage-pile";
  return (
    <header className="h-[50px] border-b bg-gradient-to-b py-2 border-neutral-800 bg-zinc-800/30 from-inherit">
      <nav className="max-w-7xl px-4 mx-auto flex items-center gap-2 text-sm font-bold">
        <Link
          href="/"
          className="text-lg md:text-2xl font-extrabold tracking-tight whitespace-nowrap"
        >
          PALIA<span className="text-xs text-gray-400">.TH.GL</span>
        </Link>

        <Link
          href={`/${lang}/${dict.maps[DEFAULT_MAP]}`}
          className={cn(
            "flex whitespace-nowrap items-center gap-1 text-gray-400 px-2 py-1 hover:text-white transition-colors",
            {
              "text-brand":
                !isDownloadPage && !isLeaderboardPage && !isRummagePilePage,
            }
          )}
        >
          <svg
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
            <path d="M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13" />
            <path d="M9 4v13" />
            <path d="M15 7v13" />
          </svg>
          <span className="hidden md:block">{dict.menu.interactiveMap}</span>
        </Link>
        <Link
          href={`/${lang}/leaderboard`}
          className={cn(
            "flex whitespace-nowrap items-center gap-1  text-gray-400 px-2 py-1 hover:text-white transition-colors",
            {
              "text-brand": isLeaderboardPage,
            }
          )}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <g
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="4"
            >
              <path strokeLinecap="round" d="M17 18H4v24h13V18Z" />
              <path d="M30 6H17v36h13V6Z" />
              <path strokeLinecap="round" d="M43 26H30v16h13V26Z" />
            </g>
          </svg>
          <span className="hidden md:block">{dict.menu.leaderboard}</span>
        </Link>
        <Link
          href={`/${lang}/rummage-pile`}
          className={cn(
            "flex whitespace-nowrap items-center gap-1  text-gray-400 px-2 py-1 hover:text-white transition-colors",
            {
              "text-brand": isRummagePilePage,
            }
          )}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 6l-8 4l8 4l8 -4l-8 -4" />
            <path d="M4 14l8 4l8 -4" />
          </svg>
          <span className="hidden md:block">{dict.menu.rummagePile}</span>
        </Link>
        <a
          href="https://discord.gg/NTZu8Px"
          target="_blank"
          className="ml-auto flex whitespace-nowrap items-center bg-[#6974f3]/70 border border-white/10 rounded-md px-2 py-1 hover:bg-[#6974f3] hover:border-white/15 transition-colors"
        >
          <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
          </svg>
          <span className="ml-1 hidden md:block">Discord</span>
        </a>
        {children}
        <AppDownload active={isDownloadPage} />
      </nav>
    </header>
  );
}
