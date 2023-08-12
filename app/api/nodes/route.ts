import { isOverwolf } from "@/app/lib/env";
import { loadDictionary } from "@/app/lib/i18n";
import { NODE_TYPE, SIMPLE_NODE, staticNodes } from "@/app/lib/nodes";
import { NextRequest, NextResponse } from "next/server";

async function _GET(request: NextRequest) {
  const result = {
    ...Object.keys(staticNodes).reduce(
      (acc, key) => {
        acc[key as NODE_TYPE] = [];
        return acc;
      },
      {} as Record<NODE_TYPE, SIMPLE_NODE[]>,
    ),
  };

  const search = request.nextUrl.search;
  const searchParams = new URLSearchParams(search);
  const q = searchParams.get("q")?.toLowerCase();
  const locale = searchParams.get("locale")?.toLowerCase();
  const dict = loadDictionary(locale);
  if (!q) {
    Object.entries(staticNodes).forEach(([key, items]) => {
      items.forEach((node) => {
        const terms = (dict.generated as any)[key]?.[
          "termId" in node ? (node.termId as string) : node.id
        ];

        const langNode = { ...node };
        Object.assign(langNode, terms);

        result[key as NODE_TYPE].push(langNode);
      });
    });

    return NextResponse.json(result);
  }

  Object.entries(staticNodes).forEach(([key, items]) => {
    items.forEach((node) => {
      const terms = (dict.generated as any)[key]?.[
        "termId" in node ? (node.termId as string) : node.id
      ];
      if (
        terms?.name?.toLowerCase().includes(q) ||
        terms?.description?.toLowerCase().includes(q) ||
        ("attribute" in node &&
          (node.attribute as string)?.toLowerCase().includes(q))
      ) {
        const langNode = { ...node };
        Object.assign(langNode, terms);

        result[key as NODE_TYPE].push(langNode);
      }
    });
  });

  return NextResponse.json(result);
}

export const GET = isOverwolf ? undefined : _GET;
