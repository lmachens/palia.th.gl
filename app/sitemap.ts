import { MetadataRoute } from "next";
import { nodes } from "./lib/nodes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const nodesMap = nodes.map((node) => ({
    url: `https://diablo4.th.gl/nodes/${encodeURIComponent(
      "name" in node ? node.name : node.type,
    )}/@${node.x},${node.y}`,
    lastModified: now,
  }));

  return [
    {
      url: "https://diablo4.th.gl",
      lastModified: now,
    },
    ...nodesMap,
  ];
}
