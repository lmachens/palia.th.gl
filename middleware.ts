import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALES, loadDictionary } from "./app/lib/i18n";
import { DEFAULT_MAP, isMap } from "./app/lib/maps";

const COOKIE_NAME = "i18next";

function getUserLanguage(req: NextRequest) {
  if (req.cookies.has(COOKIE_NAME)) {
    const cookie = req.cookies.get(COOKIE_NAME)!.value;
    if (LOCALES.includes(cookie)) {
      return cookie;
    }
  }
  return DEFAULT_LOCALE;
}

function getPathParams(pathname: string) {
  const [, pathLanguage, map] = pathname.split("/") ?? [];
  if (pathLanguage && LOCALES.includes(pathLanguage)) {
    if (!map) {
      return { pathLanguage, map: null };
    }
    const dict = loadDictionary(pathLanguage);
    const mapTitle = decodeURIComponent(map);
    const mapEntry = Object.entries(dict.maps).find(([, value]) => {
      return value === mapTitle;
    });

    if (mapEntry && isMap(mapEntry[0])) {
      return { pathLanguage, map: mapEntry[0] };
    }
    return { pathLanguage, map: null };
  }
  return { pathLanguage: null, map: null };
}

export async function middleware(req: NextRequest) {
  const userLanguage = getUserLanguage(req);
  const dict = loadDictionary(userLanguage);
  const { pathLanguage, map } = getPathParams(req.nextUrl.pathname);
  if (pathLanguage) {
    if (!map) {
      const res = NextResponse.redirect(
        new URL(`/${pathLanguage}/${dict.maps[DEFAULT_MAP]}`, req.url)
      );
      res.cookies.set(COOKIE_NAME, pathLanguage, {
        maxAge: 60 * 60 * 24 * 30,
      });
      return res;
    }
  } else {
    return NextResponse.redirect(
      new URL(
        `/${userLanguage}/${dict.maps[DEFAULT_MAP]}${req.nextUrl.search}`,
        req.url
      )
    );
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|maps|icons|embed|app|controller|sitemap.xml|robots.txt|manifest|social).*)",
  ],
};
