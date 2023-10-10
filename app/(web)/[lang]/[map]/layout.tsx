import Nodes from "@/app/components/(map)/nodes";
import Tiles from "@/app/components/(map)/tiles";
import Download from "@/app/components/download";
import Search from "@/app/components/search";
import { loadDictionary } from "@/app/lib/i18n";
import { isMap } from "@/app/lib/maps";
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

function Layout({
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
    const mapTitle = decodeURIComponent(map);
    const mapEntry = Object.entries(dict.maps).find(([, value]) => {
      return value === mapTitle;
    });

    if (!mapEntry || !isMap(mapEntry[0])) {
      notFound();
    }
    content = (
      <>
        <Map map={mapEntry[0]}>
          <Tiles map={mapEntry[0]} />
          <Nodes map={mapEntry[0]} />
          <ActiveRoutes />
        </Map>
        <Search map={mapEntry[0]} />
      </>
    );
  }
  return (
    <>
      {content}
      {children}
    </>
  );
}

export default Layout;
