import { MetadataRoute } from "next";
import { loadDictionary } from "./lib/i18n";
import { nodes } from "./lib/nodes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const nodesMap = nodes.map((node) => {
    const dict = loadDictionary("en");
    const name = (dict.generated as any)[node.type]?.[node.id]?.name ?? "";
    return {
      url: `https://palia.th.gl/nodes/${encodeURIComponent(
        name || node.type
      )}/@${node.x},${node.y}`,
      lastModified: now,
    };
  });

  return [
    {
      url: "https://palia.th.gl",
      lastModified: now,
    },
    ...nodesMap,
  ];
}
