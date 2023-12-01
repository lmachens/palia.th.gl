import { isOverwolf } from "@/lib/env";
import { loadDictionary } from "@/lib/i18n";
import { nodes } from "@/lib/nodes";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

async function _GET(request: NextRequest) {
  const search = request.nextUrl.search;
  const searchParams = new URLSearchParams(search);
  const q = searchParams.get("q")?.toLowerCase();
  const locale = searchParams.get("locale")?.toLowerCase();
  const dict = loadDictionary(locale);
  const langNodes = nodes.map((node) => {
    const dictEntry = node.isSpawnNode
      ? dict.spawnNodes[node.type]
      : dict.generated[node.type]?.[node.id];

    const name = dictEntry?.name || dict.nodes[node.type] || "";
    const description = dictEntry?.description || "";
    const langNode = { ...node, name, description };
    return langNode;
  });
  if (!q) {
    return NextResponse.json(langNodes);
  }

  const result = langNodes.filter((node) => {
    return (
      node.name.toLowerCase().includes(q) ||
      node.description.toLowerCase().includes(q)
    );
  });
  return NextResponse.json(result);
}

export const GET = isOverwolf ? undefined : _GET;
