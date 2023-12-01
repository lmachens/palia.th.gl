import "@/app/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import { I18NProvider } from "@/components/(i18n)/i18n-provider";
import Nodes from "@/components/(map)/nodes";
import Tiles from "@/components/(map)/tiles";
import EmbedLink from "@/components/embed-link";
import PlausibleTracker from "@/components/plausible-tracker";
import { DEFAULT_LOCALE, LOCALES, isLang, loadDictionary } from "@/lib/i18n";
import { isMap } from "@/lib/maps";
import { ParamsProvider } from "@/lib/storage/params";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

export { generateMetadata } from "@/lib/meta";

const Map = dynamic(() => import("@/components/(map)/map"), {
  ssr: false,
});

const Search = dynamic(() => import("@/components/search"), {
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
  const mapTitle = decodeURIComponent(map);
  const mapEntry = Object.entries(dict.maps).find(([, value]) => {
    return value === mapTitle;
  });

  if (!mapEntry || !isMap(mapEntry[0])) {
    notFound();
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
          <ParamsProvider>
            <Map>
              <Tiles />
              <Nodes />
              <Search hidden />
            </Map>
            <EmbedLink />
            {children}
          </ParamsProvider>
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
