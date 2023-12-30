import { LEADERBOARD_TAG, RUMMAGE_PILE_TAG } from "./revalidate";

export async function takeScreenshot(
  url: string,
  size: { width: number; height: number }
) {
  const tags: string[] = [];
  if (url.includes("/leaderboard")) {
    tags.push(LEADERBOARD_TAG);
  } else if (url.includes("/rummage-pile")) {
    tags.push(RUMMAGE_PILE_TAG);
  }

  const response = await fetch(
    `https://chrome.browserless.io/screenshot?token=${process.env.BROWSERLESS_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({
        url: url,
        gotoOptions: {
          waitUntil: "networkidle0",
        },
        options: {
          fullPage: true,
          type: "jpeg",
          quality: 75,
        },
        viewport: {
          ...size,
        },
      }),
      next: {
        tags,
      },
    }
  );
  const result = await response.arrayBuffer();
  return result;
}
