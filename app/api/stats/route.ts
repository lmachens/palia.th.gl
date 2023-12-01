import { isOverwolf } from "@/lib/env";
import { nodes } from "@/lib/nodes";
import { NextResponse } from "next/server";

async function _GET() {
  const stats = nodes.reduce((acc, node) => {
    if (!acc[node.mapName]) {
      acc[node.mapName] = {};
    }
    if (!acc[node.mapName][node.type]) {
      acc[node.mapName][node.type] = 0;
    }
    acc[node.mapName][node.type]++;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  return NextResponse.json(stats);
}

export const GET = isOverwolf ? undefined : _GET;
