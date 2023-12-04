import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

import { I18NProvider } from "@/components/(i18n)/i18n-provider";
import Footer from "@/components/footer";
import PlausibleTracker from "@/components/plausible-tracker";
import { DEFAULT_LOCALE, LOCALES, isLang, loadDictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Viewport } from "next";
import { notFound } from "next/navigation";

export const viewport: Viewport = {
  themeColor: "black",
};
export { generateMetadata } from "@/lib/meta";

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
        className={cn(
          "font-sans dark min-h-dscreen bg-black text-white antialiased select-none relative flex flex-col",
          fontSans.variable
        )}
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
          <Footer />
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
