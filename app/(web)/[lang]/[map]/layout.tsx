import Nodes from "@/app/components/(map)/nodes";
import Tiles from "@/app/components/(map)/tiles";
import Download from "@/app/components/download";
import Search from "@/app/components/search";
import WeeklyWants from "@/app/components/weekly-wants";
import { loadDictionary } from "@/app/lib/i18n";
import { isMap } from "@/app/lib/maps";
import { ParamsProvider } from "@/app/lib/storage/params";
import { fetchWeeklyWants } from "@/app/lib/weekly-wants";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

export { generateMetadata } from "@/app/lib/meta";

const Map = dynamic(() => import("@/app/components/(map)/map"), {
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
  let content: JSX.Element;
  if (map === "download") {
    content = <Download />;
  } else {
    const weeklyWants = await fetchWeeklyWants(lang);
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
        <Search>
          <WeeklyWants data={weeklyWants} />
        </Search>
      </>
    );
  }
  return (
    <ParamsProvider>
      {content}
      {children}
    </ParamsProvider>
  );
}

export default Layout;
