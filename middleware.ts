import { DEFAULT_LOCALE, LOCALES, loadDictionary } from "@/lib/i18n";
import { DEFAULT_MAP, isMap } from "@/lib/maps";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PARAMS_COOKIE_NAME = "params";
const validPages = [
  "download",
  "leaderboard",
  "rummage-pile",
  "winterfest-challenge",
];

function getUserParams(req: NextRequest) {
  if (req.cookies.has(PARAMS_COOKIE_NAME)) {
    const cookie = decodeURIComponent(
      req.cookies.get(PARAMS_COOKIE_NAME)!.value
    );
    return cookie;
  }
  return null;
}

function getPathParams(pathname: string) {
  const [, pathLanguage, page] = pathname.split("/") ?? [];
  if (pathLanguage && LOCALES.includes(pathLanguage)) {
    if (!page) {
      return { pathLanguage, page: null };
    }
    const dict = loadDictionary(pathLanguage);
    const mapTitle = decodeURIComponent(page);
    const mapEntry = Object.entries(dict.maps).find(([, value]) => {
      return value === mapTitle;
    });

    if (mapEntry && isMap(mapEntry[0])) {
      return { pathLanguage, page: mapEntry[0] };
    } else if (validPages.includes(page)) {
      return { pathLanguage, page: page };
    }
    return { pathLanguage, page: null };
  }
  return { pathLanguage: null, page: null };
}

export async function middleware(req: NextRequest) {
  const { pathLanguage, page } = getPathParams(req.nextUrl.pathname);
  if (!pathLanguage) {
    // Redirect if no language is present
    const userParams = getUserParams(req);
    if (userParams) {
      // Redirect to user params if present
      return NextResponse.redirect(new URL(userParams, req.url));
    } else {
      // Redirect to default language and map. Remember to add search params for referrer
      const dict = loadDictionary(DEFAULT_LOCALE);
      return NextResponse.redirect(
        new URL(
          `/${DEFAULT_LOCALE}/${dict.maps[DEFAULT_MAP]}${req.nextUrl.search}`,
          req.url
        )
      );
    }
  }
  if (!page) {
    // Redirect if only language is present
    const dict = loadDictionary(pathLanguage);
    return NextResponse.redirect(
      new URL(`/${pathLanguage}/${dict.maps[DEFAULT_MAP]}`, req.url)
    );
  } else if (!req.nextUrl.search) {
    // Redirect if language and page are present but no params
    const userParams = getUserParams(req);
    if (userParams) {
      const search = userParams.split("?")[1];
      if (search) {
        return NextResponse.redirect(new URL(`${req.url}?${search}`, req.url));
      }
    }
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|maps|icons|embed|app|controller|sitemap.xml|robots.txt|manifest|social|icon).*)",
  ],
};
