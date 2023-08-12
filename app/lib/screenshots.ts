export async function takeScreenshot(
  url: string,
  size: { width: number; height: number },
) {
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
    },
  );
  const result = await response.arrayBuffer();
  return result;
}
