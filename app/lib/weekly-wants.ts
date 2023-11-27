import { loadDBDictionary } from "./i18n";

export async function fetchWeeklyWants(
  locale: string
): Promise<WEEKLY_WANTS | undefined> {
  const dict = loadDBDictionary(locale);
  try {
    const response = await fetch("https://palia-api.th.gl/weekly-wants", {
      next: { revalidate: 600 },
    });
    if (!response.ok) {
      console.error(response.status, response.statusText);
      throw new Error("Failed to fetch weekly wants with API key");
    }
    const data = (await response.json()) as API_WEEKLY_WANTS;
    const weeklyWants = Object.entries(data.preferences).reduce(
      (acc, [key, wants]) => {
        acc[key] = wants
          .map((value) => {
            const terms = dict[value.objectId as keyof typeof dict];
            return {
              id: value.itemPersistId,
              item: value.objectId,
              name: terms?.name ?? value.objectId,
              description: terms?.description,
              rewardLevel: value.rewardLevel as REWARD_LEVEL,
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));
        return acc;
      },
      {} as Record<
        string,
        {
          id: number;
          name: string;
          item: string;
          description?: string;
          rewardLevel: REWARD_LEVEL;
        }[]
      >
    );
    const result = {
      version: data.version,
      timestamp: data.timestamp,
      weeklyWants,
    };
    return result;
  } catch (err) {
    //
    return undefined;
  }
}

type REWARD_LEVEL = "Like" | "Love";
type Items = Array<{
  objectId: string;
  persistId: number;
  itemPersistId: number;
  rewardLevel: string;
}>;
type API_WEEKLY_WANTS = {
  version: number;
  timestamp: number;
  preferences: {
    theinnkeeper: Items;
    deliveryboy: Items;
    thefarmer: Items;
    fisherman: Items;
    themagistrate: Items;
    thehunter: Items;
    thenanny: Items;
    thetailor: Items;
    themayor: Items;
    themayorsdaughter: Items;
    thedemolitionist: Items;
    thefarmboy: Items;
    thecook: Items;
    theblacksmith: Items;
    thealchemist: Items;
    thecarpenter: Items;
    thesalesman: Items;
    therancher: Items;
    theminer: Items;
    thelibrarian: Items;
    thecurator: Items;
    thehealer: Items;
    thearcheologist: Items;
    theplumehound: Items;
    thewatcher: Items;
  };
};

export type WEEKLY_WANTS = {
  version: number;
  timestamp: number;
  weeklyWants: Record<
    string,
    {
      id: number;
      item: string;
      name: string;
      description?: string;
      rewardLevel: REWARD_LEVEL;
    }[]
  >;
};
