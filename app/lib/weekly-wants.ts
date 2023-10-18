import { loadDBDictionary } from "./i18n";

export async function fetchWeeklyWants(locale: string): Promise<WEEKLY_WANTS | undefined> {
  const dict = loadDBDictionary(locale);
  if (!process.env.PALIAPEDIA_API_KEY) {
    console.error("Missing PALIAPEDIA_API_KEY");
    return;
  }
  const response = await fetch(
    `https://api.paliapedia.com/api/weekly-wants?k=${
      process.env.PALIAPEDIA_API_KEY
    }&random=${Math.random()}`,
    {
      headers: {
        "User-Agent": process.env.PALIAPEDIA_API_KEY,
      },
      next: { revalidate: 3600 },
    }
  );
  if (!response.ok) {
    console.error(response.status, response.statusText);
    throw new Error("Failed to fetch weekly wants with API key");
  }
  const data = (await response.json()) as PALIAPEDIA_WEEKLY_WANTS;
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
        id: string;
        name: string;
        item: string;
        description?: string;
        rewardLevel: REWARD_LEVEL;
      }[]
    >
  );
  const result = {
    version: data.version,
    weeklyWants,
  };
  return result;
}

type REWARD_LEVEL = "Like" | "Love";
type PALIAPEDIA_WEEKLY_WANTS = {
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

export type WEEKLY_WANTS = {
  version: number;
  weeklyWants: Record<
    string,
    {
      id: string;
      item: string;
      name: string;
      description?: string;
      rewardLevel: REWARD_LEVEL;
    }[]
  >;
};
