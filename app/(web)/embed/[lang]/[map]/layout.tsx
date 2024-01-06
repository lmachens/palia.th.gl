import "@/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import Download from "@/components/(download)/download";
import { I18NProvider } from "@/components/(i18n)/i18n-provider";
import Leaderboard from "@/components/(leaderboard)/leaderboard";
import Nodes from "@/components/(map)/nodes";
import Tiles from "@/components/(map)/tiles";
import RummagePile from "@/components/(rummage-pile)/rummage-pile";
import WinterfestChallenge from "@/components/(winterfest-challenge)/winterfest-challenge";
import EmbedLink from "@/components/embed-link";
import PlausibleTracker from "@/components/plausible-tracker";
import { DEFAULT_LOCALE, LOCALES, isLang, loadDictionary } from "@/lib/i18n";
import { isMap } from "@/lib/maps";
import { ParamsProvider } from "@/lib/storage/params";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const Map = dynamic(() => import("@/components/(map)/map"), {
  ssr: false,
});

function Layout({
  children,
  params: { lang, map },
}: {
  children: React.ReactNode;
  params: { lang: string; map: string };
}) {
  if (!isLang(lang)) {
    notFound();
  }

  const dict = loadDictionary(lang);
  let content: JSX.Element;
  if (map === "download") {
    content = <Download isScreenshot />;
  } else if (map === "leaderboard") {
    content = <Leaderboard dict={dict} isScreenshot />;
  } else if (map === "rummage-pile") {
    content = <RummagePile dict={dict} isScreenshot />;
  } else if (map === "winterfest-challenge") {
    content = <WinterfestChallenge dict={dict} isScreenshot />;
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
        </Map>
        <EmbedLink />
      </>
    );
  }
  return (
    <html lang={lang}>
      <body
        className={`${inter.className} h-screen bg-black text-white overflow-hidden print`}
      >
        <I18NProvider
          value={{
            dict,
            defaultLocale: DEFAULT_LOCALE,
            locale: lang,
            locales: LOCALES,
          }}
        >
          <Suspense>
            <ParamsProvider>
              {content}
              {children}
            </ParamsProvider>
          </Suspense>
        </I18NProvider>

        <PlausibleTracker
          domain={process.env.NEXT_PUBLIC_PLAUSIBLE_EMBED_DOMAIN}
          apiHost={process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST}
        />
      </body>
    </html>
  );
}

export default Layout;
