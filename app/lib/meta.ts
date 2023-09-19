import { Metadata } from "next";
import { notFound } from "next/navigation";
import { API_BASE_URI, isDevelopment } from "./env";
import { DEFAULT_LOCALE, LOCALES, loadDictionary } from "./i18n";
import { isMap } from "./maps";
import { nodes } from "./nodes";

export function generateMetadata({
  params: { lang = DEFAULT_LOCALE, map, name, coordinates: paramsCoordinates },
  searchParams,
}: {
  params: { lang: string; map: string; name?: string; coordinates?: string };
  searchParams: { [key: string]: string | string[] | undefined };
}): Metadata {
  const dict = loadDictionary(lang);
  const title = name && decodeURIComponent(name);
  const mapTitle = decodeURIComponent(map);
  const coordinates =
    (paramsCoordinates && decodeURIComponent(paramsCoordinates))
      ?.replace("@", "")
      .split(",")
      .map(Number) ?? [];

  const node =
    name &&
    nodes.find((node) => {
      return node.x === coordinates[0] && node.y === coordinates[1];
    });

  let canonical =
    (isDevelopment ? "http://localhost:3668" : API_BASE_URI) +
    `/${lang}/${mapTitle}`;
  let description = dict.meta.description;
  if (node) {
    const terms = !node.isSpawnNode
      ? dict.generated[node.type]?.[node.id]
      : dict.spawnNodes[node.type];
    const name = terms?.name ?? "";
    description = name;
    description += ` (${dict.nodes[node.type]})`;
    const nodeDescription = terms?.description ?? "";
    description += `. ${nodeDescription?.replace(/<\/?[^>]+(>|$)/g, "")}`;
  }

  if (name && node) {
    canonical += `/${name}/@${node.x},${node.y}`;
  }

  const mapEntry = Object.entries(dict.maps).find(([, value]) => {
    return value === mapTitle;
  });
  if (!mapEntry || !isMap(mapEntry[0])) {
    notFound();
  }

  const alternativeLanguages = LOCALES.reduce((acc, locale) => {
    const altDict = loadDictionary(locale);
    acc[locale] =
      API_BASE_URI +
      `/${locale}/${encodeURIComponent(altDict.maps[mapEntry[0]])}`;
    if (node) {
      const terms = !node.isSpawnNode
        ? altDict.generated[node.type]?.[node.id]
        : altDict.spawnNodes[node.type];
      const altName = terms?.name ?? "";
      acc[locale] += `/${encodeURIComponent(
        altName || altDict.nodes[node.type]
      )}/@${node.x},${node.y}`;
    }
    return acc;
  }, {} as Record<string, string>);

  let subtitle = "";
  if (searchParams?.filters && typeof searchParams.filters === "string") {
    const filters = decodeURIComponent(searchParams.filters)
      .split(",")
      .map((filter) => {
        return dict.nodes[filter] || dict.spawnNodes[filter]?.name;
      })
      .filter(Boolean);
    if (filters.length > 0) {
      subtitle += " | " + filters.join(", ");
    }
  }

  const metaTitle = title
    ? `${title}${subtitle} | ${mapTitle} | palia.th.gl`
    : `${mapTitle}${subtitle} | ${dict.meta.subtitle} | palia.th.gl`;

  return {
    title: metaTitle,
    description: description,
    creator: "Leon Machens",
    themeColor: "black",
    alternates: {
      canonical: canonical,
      languages: alternativeLanguages,
    },
    twitter: {
      card: "summary_large_image",
      images: name ? canonical + "/screenshot" : "/social.webp",
    },
    openGraph: {
      title: metaTitle,
      description: description,
      type: name ? "article" : "website",
      url: "https://palia.th.gl",
      images: name ? canonical + "/screenshot" : "/social.webp",
    },
  };
}
