import type { DICT } from "@/lib/i18n";
import { DEFAULT_MAP } from "@/lib/maps";
import { cn } from "@/lib/utils";
import Link from "next/link";
import AppDownload from "./app-download";
import Brand from "./brand";
import DiscordCTA from "./discord-cta";
import GlobalMenu from "./global-menu";
import LocaleSelect from "./locale-select";

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
  const isWinterfestChallenge = page === "winterfest-challenge";

  return (
    <header
      className={cn(
        "h-[50px] z-[9990] fixed left-0 right-0 top-0 border-b bg-gradient-to-b py-2 backdrop-blur-2xl border-neutral-800 bg-zinc-800/30"
      )}
    >
      <nav
        className={cn(
          "max-w-7xl px-2 mx-auto flex items-center gap-2 text-sm font-bold overflow-auto"
        )}
      >
        <GlobalMenu dict={dict} />
        <Link href="/" className="hidden sm:block">
          <Brand />
        </Link>

        <Link
          href={`/${lang}/${dict.maps[DEFAULT_MAP]}`}
          className={cn(
            "flex whitespace-nowrap items-center gap-1 text-gray-400 px-2 py-1 hover:text-white transition-colors",
            {
              "text-brand":
                !isDownloadPage &&
                !isLeaderboardPage &&
                !isRummagePilePage &&
                !isWinterfestChallenge,
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
          <span className="hidden lg:block">{dict.menu.interactiveMap}</span>
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
          <span className="hidden lg:block">{dict.menu.leaderboard}</span>
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
          <span className="hidden lg:block">{dict.menu.rummagePile}</span>
        </Link>
        <Link
          href={`/${lang}/winterfest-challenge`}
          className={cn(
            "flex whitespace-nowrap items-center gap-1  text-gray-400 px-2 py-1 hover:text-white transition-colors",
            {
              "text-brand": isWinterfestChallenge,
            }
          )}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 4l2 1l2 -1" />
            <path d="M12 2v6.5l3 1.72" />
            <path d="M17.928 6.268l.134 2.232l1.866 1.232" />
            <path d="M20.66 7l-5.629 3.25l.01 3.458" />
            <path d="M19.928 14.268l-1.866 1.232l-.134 2.232" />
            <path d="M20.66 17l-5.629 -3.25l-2.99 1.738" />
            <path d="M14 20l-2 -1l-2 1" />
            <path d="M12 22v-6.5l-3 -1.72" />
            <path d="M6.072 17.732l-.134 -2.232l-1.866 -1.232" />
            <path d="M3.34 17l5.629 -3.25l-.01 -3.458" />
            <path d="M4.072 9.732l1.866 -1.232l.134 -2.232" />
            <path d="M3.34 7l5.629 3.25l2.99 -1.738" />
          </svg>
          <span className="hidden lg:block">
            {dict.menu.winterfestChallenge}
          </span>
        </Link>
        <div className="grow" />
        {children}
        <AppDownload active={isDownloadPage} />
        <DiscordCTA />
        <LocaleSelect />
      </nav>
    </header>
  );
}
