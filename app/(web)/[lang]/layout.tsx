import "@/app/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import { I18NProvider } from "@/app/components/(i18n)/i18n-provider";
import Menu from "@/app/components/menu";
import NitroPay from "@/app/components/nitro-pay";
import PlausibleTracker from "@/app/components/plausible-tracker";
import {
  DEFAULT_LOCALE,
  LOCALES,
  isLang,
  loadDictionary,
} from "@/app/lib/i18n";
import type { Viewport } from "next";
import { notFound } from "next/navigation";

export const viewport: Viewport = {
  themeColor: "black",
};
export { generateMetadata } from "@/app/lib/meta";

function Layout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
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
          {children}
          <Menu top={<NitroPay />} />
        </I18NProvider>
        <PlausibleTracker
          domain={process.env.NEXT_PUBLIC_PLAUSIBLE_WEB_DOMAIN}
          apiHost={process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST}
        />
      </body>
    </html>
  );
}
export default Layout;
