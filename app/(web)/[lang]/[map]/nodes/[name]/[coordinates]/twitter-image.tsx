import { takeScreenshot } from "@/app/lib/screenshots";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 628,
};

export const contentType = "image/jpeg";

export default async function Image({
  params: { name, coordinates },
}: {
  params: { name: string; coordinates: string };
}) {
  const url = `https://palia.th.gl/en/embed/nodes/${name}/${coordinates}?screenshot=true`;
  const screenshot = await takeScreenshot(url, size);
  const response = new NextResponse(screenshot, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, stale-while-revalidate",
    },
  });
  return response;
}
