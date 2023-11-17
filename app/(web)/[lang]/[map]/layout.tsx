import Download from "@/app/components/(download)/download";
import Leaderboard from "@/app/components/(leaderboard)/leaderboard";
import WeeklyWants from "@/app/components/(weekly-wants)/weekly-wants";
import Search from "@/app/components/search";
import WebHeader from "@/app/components/web-header";
import { loadDictionary } from "@/app/lib/i18n";
import { isMap } from "@/app/lib/maps";
import { ParamsProvider } from "@/app/lib/storage/params";
import { fetchWeeklyWants } from "@/app/lib/weekly-wants";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

export { generateMetadata } from "@/app/lib/meta";

const Tiles = dynamic(() => import("@/app/components/(map)/tiles"), {
  ssr: false,
});
const Map = dynamic(() => import("@/app/components/(map)/map"), {
  ssr: false,
});
const Nodes = dynamic(() => import("@/app/components/(map)/nodes"), {
  ssr: false,
});

const ActiveRoutes = dynamic(
  () => import("@/app/components/(map)/active-routes"),
  {
    ssr: false,
  }
);

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
  } else {
    const mapTitle = decodeURIComponent(map);
    const mapEntry = Object.entries(dict.maps).find(([, value]) => {
      return value === mapTitle;
    });

    if (!mapEntry || !isMap(mapEntry[0])) {
      notFound();
    }
    content = (
      <>
        <Map>
          <Tiles />
          <Nodes />
          <ActiveRoutes />
        </Map>
        <Search />
      </>
    );
  }
  return (
    <>
      <WebHeader lang={lang} page={map} dict={dict}>
        <WeeklyWants data={weeklyWants} />
      </WebHeader>
      <ParamsProvider>
        {content}
        {children}
      </ParamsProvider>
    </>
  );
}

export default Layout;
