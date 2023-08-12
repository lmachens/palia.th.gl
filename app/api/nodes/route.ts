import { isOverwolf } from "@/app/lib/env";
import { NODE_TYPE, SIMPLE_NODE, staticNodes } from "@/app/lib/nodes";
import { NextRequest, NextResponse } from "next/server";

async function _GET(request: NextRequest) {
  const search = request.nextUrl.search;
  const q = new URLSearchParams(search).get("q")?.toLowerCase();
  if (!q) {
    return NextResponse.json(staticNodes);
  }
  const result = {
    ...Object.keys(staticNodes).reduce(
      (acc, key) => {
        acc[key as NODE_TYPE] = [];
        return acc;
      },
      {} as Record<NODE_TYPE, SIMPLE_NODE[]>,
    ),
  };

  Object.entries(staticNodes).forEach(([key, items]) => {
    items.forEach((node) => {
      if (
        ("name" in node && (node.name as string).toLowerCase().includes(q)) ||
        ("attribute" in node &&
          (node.attribute as string)?.toLowerCase().includes(q))
      ) {
        result[key as NODE_TYPE].push(node);
      }
    });
  });

  return NextResponse.json(result);
}

export const GET = isOverwolf ? undefined : _GET;
