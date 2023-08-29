import "@/app/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import { I18NProvider } from "@/app/components/(i18n)/i18n-provider";
import ActiveRoutes from "@/app/components/(map)/active-routes";
import Nodes from "@/app/components/(map)/nodes";
import Tiles from "@/app/components/(map)/tiles";
import Menu from "@/app/components/menu";
import PlausibleTracker from "@/app/components/plausible-tracker";
import SearchParams from "@/app/components/search-params";
import {
  DEFAULT_LOCALE,
  LOCALES,
  isLang,
  loadDictionary,
} from "@/app/lib/i18n";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

export { generateMetadata } from "@/app/lib/meta";

const Map = dynamic(() => import("@/app/components/(map)/map"), {
  ssr: false,
});

const Search = dynamic(() => import("@/app/components/search"), {
  ssr: false,
});

function Layout({
  // children,
  params: { lang, map },
}: {
  children: React.ReactNode;
  params: { lang: string; map: string };
}) {
  if (!isLang(lang)) {
    notFound();
  }

  const dict = loadDictionary(lang);

  return (
    <html lang={lang}>
      <body
        className={`${inter.className} h-screen bg-black text-white antialiased select-none overflow-hidden`}
      >
        <I18NProvider
          value={{
            defaultLocale: DEFAULT_LOCALE,
            locale: lang,
            locales: LOCALES,
            dict,
          }}
        >
          <Map map={map}>
            <Tiles map={map} />
            <Nodes map={map} />
            <ActiveRoutes />
            <Search />
            <Menu />
          </Map>
        </I18NProvider>
        <SearchParams />
        <PlausibleTracker
          domain={process.env.NEXT_PUBLIC_PLAUSIBLE_WEB_DOMAIN}
          apiHost={process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST}
        />
      </body>
    </html>
  );
}

export default Layout;
