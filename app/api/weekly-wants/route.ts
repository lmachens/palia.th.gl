import { isOverwolf } from "@/app/lib/env";
import { DEFAULT_LOCALE } from "@/app/lib/i18n";
import { fetchWeeklyWants } from "@/app/lib/weekly-wants";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

async function _GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") ?? DEFAULT_LOCALE;
  if (!request.headers.get("User-Agent")?.includes("OverwolfClient")) {
    return NextResponse.json({ error: "Not Overwolf" }, { status: 400 });
  }
  const result = await fetchWeeklyWants(locale);
  return NextResponse.json(result);
}

export const GET = isOverwolf ? undefined : _GET;
