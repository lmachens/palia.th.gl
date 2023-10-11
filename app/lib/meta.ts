import type { Metadata } from "next";
import { API_BASE_URI, isDevelopment } from "./env";
import { DEFAULT_LOCALE, LOCALES, loadDictionary } from "./i18n";
import { nodes } from "./nodes";

const DEFAULT_META = {
  creator: "Leon Machens",
  themeColor: "black",
};

export function generateMetadata({
  params: { lang = DEFAULT_LOCALE, map, name, coordinates: paramsCoordinates },
  searchParams,
}: {
  params: { lang: string; map?: string; name?: string; coordinates?: string };
  searchParams: { [key: string]: string | string[] | undefined };
}): Metadata {
  const dict = loadDictionary(lang);
  let canonical =
    (isDevelopment ? "http://localhost:3668" : API_BASE_URI) + `/${lang}`;

  if (map === "download") {
    const metaTitle = dict.download.metaTitle;
    const description = dict.download.metaDescription;

    const alternativeLanguages = LOCALES.reduce((acc, locale) => {
      acc[locale] = API_BASE_URI + `/${locale}/download`;
      return acc;
    }, {} as Record<string, string>);

    return {
      title: metaTitle,
      description: description,
      alternates: {
        canonical: canonical + "/download",
        languages: alternativeLanguages,
      },
      twitter: {
        card: "summary_large_image",
      },
      openGraph: {
        title: metaTitle,
        description: description,
        type: "website",
        url: "https://palia.th.gl",
      },
      ...DEFAULT_META,
    };
  }

  const title = name && decodeURIComponent(name);
  const mapTitle = map ? decodeURIComponent(map) : "";
  const coordinates =
    (paramsCoordinates && decodeURIComponent(paramsCoordinates))
      ?.replace("@", "")
      .split(",")
      .map(Number) ?? [];

  const node =
    name?.length &&
    nodes.find((node) => {
      return node.x === coordinates[0] && node.y === coordinates[1];
    });

  canonical += `/${mapTitle}`;
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

  const alternativeLanguages = LOCALES.reduce((acc, locale) => {
    const altDict = loadDictionary(locale);
    acc[locale] = API_BASE_URI + `/${locale}`;
    if (mapEntry) {
      acc[locale] += `/${encodeURIComponent(altDict.maps[mapEntry[0]])}`;
    }
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
      description = `${filters.join(", ")} ${
        dict.meta.locations
      }. ${description}`;
    }
  }

  const metaTitle = title
    ? `${title}${subtitle} | ${mapTitle} | palia.th.gl`
    : `${mapTitle}${subtitle} | ${dict.meta.subtitle} | palia.th.gl`;

  let screenshotUrl = canonical + "/screenshot";
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value], index) => {
      if (index === 0) {
        screenshotUrl += "?";
      } else {
        screenshotUrl += "&";
      }
      screenshotUrl += `${key}=${value}`;
    });
  }

  return {
    metadataBase: new URL(canonical),
    title: metaTitle,
    description: description,
    alternates: {
      canonical: canonical,
      languages: alternativeLanguages,
    },
    twitter: {
      card: "summary_large_image",
      images: screenshotUrl,
    },
    openGraph: {
      title: metaTitle,
      description: description,
      type: name ? "article" : "website",
      url: "https://palia.th.gl",
      images: screenshotUrl,
    },
    ...DEFAULT_META,
  };
}
