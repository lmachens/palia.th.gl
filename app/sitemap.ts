import { MetadataRoute } from "next";
import { loadDictionary } from "./lib/i18n";
import { nodes } from "./lib/nodes";

export default function sitemap(): MetadataRoute.Sitemap {
  const dict = loadDictionary();

  const now = new Date();
  const nodesMap = nodes.map<MetadataRoute.Sitemap[number]>((node) => {
    let name = "";
    if (!node.isSpawnNode) {
      name = dict.generated[node.type]?.[node.id]?.name ?? "";
    } else {
      name = dict.spawnNodes[node.type].name;
    }
    return {
      url: `https://palia.th.gl/en/${node.mapName}/nodes/${encodeURIComponent(
        name
      )}/@${node.x},${node.y}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: node.isSpawnNode ? 0.5 : 0.8,
    };
  });

  return [
    {
      url: "https://palia.th.gl",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...nodesMap,
  ];
}
