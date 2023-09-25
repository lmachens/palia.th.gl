import { API_BASE_URI } from "./env";

export type REWARD_LEVEL = "Like" | "Love";
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

export async function getWeeklyWants(locale: string) {
  const response = await fetch(
    `${API_BASE_URI}/api/weekly-wants?locale=${locale}`
  );
  const data = (await response.json()) as WEEKLY_WANTS;
  return data;
}
