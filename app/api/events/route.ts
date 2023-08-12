import { isOverwolf } from "@/app/lib/env";
import { NextResponse } from "next/server";

async function _GET() {
  const response = await fetch(
    `https://d4armory.io/api/events/recent?v=${Date.now()}`,
    {},
  );
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export const GET = isOverwolf ? undefined : _GET;
