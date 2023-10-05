import { isOverwolf } from "@/app/lib/env";
import { DEFAULT_LOCALE, loadDBDictionary } from "@/app/lib/i18n";
import { NextRequest, NextResponse } from "next/server";

async function _GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") ?? DEFAULT_LOCALE;
  const dict = loadDBDictionary(locale);

  const response = await fetch(
    `https://api.paliapedia.com/api/weekly-wants?k=${
      process.env.PALIAPEDIA_API_KEY
    }&random=${Math.random()}`,
    {
      headers: {
        "User-Agent": process.env.PALIAPEDIA_API_KEY!,
      },
    }
  );
  const data = (await response.json()) as WEEKLY_WANTS;
  const weeklyWants = Object.entries(data.preferences).reduce(
    (acc, [key, wants]) => {
      acc[key] = wants
        .map((value) => {
          const terms = dict[value.name as keyof typeof dict];

          return {
            id: value.name,
            item: value.item,
            name: terms?.name ?? value.name,
            description: terms?.description,
            rewardLevel: value.rewardLevel,
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
      return acc;
    },
    {} as Record<
      string,
      {
        name: string;
        item: string;
        description?: string;
        rewardLevel: REWARD_LEVEL;
      }[]
    >
  );
  return NextResponse.json({
    version: data.version,
    weeklyWants,
  });
}

export const GET = isOverwolf ? undefined : _GET;

type REWARD_LEVEL = "Like" | "Love";
type WEEKLY_WANTS = {
  version: number;
  preferences: {
    theinnkeeper: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    deliveryboy: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    thefarmer: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    fisherman: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    themagistrate: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    thehunter: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    thenanny: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    thetailor: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    themayor: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    themayorsdaughter: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    thedemolitionist: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    thefarmboy: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    thecook: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    theblacksmith: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    thealchemist: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    thecarpenter: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    thesalesman: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    therancher: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    theminer: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    thelibrarian: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    thecurator: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
    thehealer: Array<{
      item: string;
      name: string;
      rewardLevel: REWARD_LEVEL;
    }>;
  };
};
