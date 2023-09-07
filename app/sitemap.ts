import { MetadataRoute } from "next";
import { DEFAULT_LOCALE, LOCALES, loadDictionary } from "./lib/i18n";
import { CONFIGS } from "./lib/maps";
import { nodes } from "./lib/nodes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const mapsMap = Object.keys(CONFIGS).flatMap<MetadataRoute.Sitemap[number]>(
    (map) => {
      return LOCALES.map((locale) => {
        const dict = loadDictionary(locale);

        return {
          url: `https://palia.th.gl/${locale}/${encodeURIComponent(
            dict.maps[map]
          )}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: locale === DEFAULT_LOCALE ? 0.9 : 0.7,
        };
      });
    }
  );

  const nodesMap = nodes.flatMap<MetadataRoute.Sitemap[number]>((node) => {
    return LOCALES.map((locale) => {
      const dict = loadDictionary(locale);

      let name = "";
      if (!node.isSpawnNode) {
        name = dict.generated[node.type]?.[node.id]?.name ?? "";
      } else {
        name = dict.spawnNodes[node.type].name;
      }
      return {
        url: `https://palia.th.gl/${locale}/${encodeURIComponent(
          dict.maps[node.mapName]
        )}/${encodeURIComponent(name || dict.nodes[node.type])}/@${node.x},${
          node.y
        }`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: node.isSpawnNode
          ? locale === DEFAULT_LOCALE
            ? 0.5
            : 0.4
          : locale === DEFAULT_LOCALE
          ? 0.8
          : 0.7,
      };
    });
  });

  return [
    {
      url: "https://palia.th.gl",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...mapsMap,
    ...nodesMap,
  ];
}
