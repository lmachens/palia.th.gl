import Download from "@/components/(download)/download";
import Leaderboard from "@/components/(leaderboard)/leaderboard";
import Villagers from "@/components/(map)/villagers";
import RummagePile from "@/components/(rummage-pile)/rummage-pile";
import StreamingReceiver from "@/components/(streaming)/streaming-receiver";
import WeeklyWants from "@/components/(weekly-wants)/weekly-wants";
import WinterfestChallenge from "@/components/(winterfest-challenge)/winterfest-challenge";
import Player from "@/components/player";
import Search from "@/components/search";
import TraceLine from "@/components/trace-line";
import WebHeader from "@/components/web-header";
import { loadDictionary } from "@/lib/i18n";
import { isMap } from "@/lib/maps";
import { ParamsProvider } from "@/lib/storage/params";
import { cn } from "@/lib/utils";
import { fetchWeeklyWants } from "@/lib/weekly-wants";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export { generateMetadata } from "@/lib/meta";

const Tiles = dynamic(() => import("@/components/(map)/tiles"), {
  ssr: false,
});
const Map = dynamic(() => import("@/components/(map)/map"), {
  ssr: false,
});
const Nodes = dynamic(() => import("@/components/(map)/nodes"), {
  ssr: false,
});

const ActiveRoutes = dynamic(() => import("@/components/(map)/active-routes"), {
  ssr: false,
});

async function Layout({
  children,
  params: { lang, map },
}: {
  children: React.ReactNode;
  params: { lang: string; map: string };
}) {
  const dict = loadDictionary(lang);
  const weeklyWants = await fetchWeeklyWants(lang);
  let content: JSX.Element;
  if (map === "download") {
    content = <Download />;
  } else if (map === "leaderboard") {
    content = <Leaderboard dict={dict} />;
  } else if (map === "rummage-pile") {
    content = <RummagePile dict={dict} />;
  } else if (map === "winterfest-challenge") {
    content = <WinterfestChallenge dict={dict} />;
  } else {
    const mapTitle = decodeURIComponent(map);
    const mapEntry = Object.entries(dict.maps).find(([, value]) => {
      return value === mapTitle;
    });

    if (!mapEntry || !isMap(mapEntry[0])) {
      notFound();
    }
    content = (
      <div className="h-dscreen pt-[50px]">
        <Map>
          <Tiles />
          <Nodes />
          <ActiveRoutes />
          <Player />
          <Villagers />
          <TraceLine />
        </Map>
        <Search>
          <StreamingReceiver
            className={cn("absolute right-1 pr-2 inset-y-0 flex items-center")}
          />
        </Search>
      </div>
    );
  }
  return (
    <>
      <WebHeader lang={lang} page={map} dict={dict}>
        <WeeklyWants data={weeklyWants} />
      </WebHeader>
      <Suspense fallback={<div className="grow" />}>
        <ParamsProvider>
          {content}
          {children}
        </ParamsProvider>
      </Suspense>
    </>
  );
}

export default Layout;
