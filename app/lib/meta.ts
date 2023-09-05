import { Metadata } from "next";
import { API_BASE_URI } from "./env";
import { DEFAULT_LOCALE, LOCALES, loadDictionary } from "./i18n";
import { nodes } from "./nodes";

export function generateMetadata({
  params: { lang = DEFAULT_LOCALE, map, name },
}: {
  params: { lang: string; map: string; name?: string };
}): Metadata {
  const dict = loadDictionary(lang);
  const title = name && decodeURIComponent(name);

  const node =
    name &&
    nodes.find((node) => {
      if (node.type === title) {
        return node;
      }
      if (!node.isSpawnNode) {
        const name = dict.generated[node.type]?.[node.id]?.name ?? "";
        return name === title;
      }
      return dict.spawnNodes[node.type].name === title;
    });

  let canonical =
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3668"
      : API_BASE_URI) + `/${lang}/${map}`;
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

  if (name) {
    canonical += `/nodes/${name}`;
  }
  const alternativeLanguages = LOCALES.reduce((acc, locale) => {
    acc[locale] = API_BASE_URI + `/${locale}`;
    if (name) {
      acc[locale] += `/nodes/${name}`;
    }
    return acc;
  }, {} as Record<string, string>);

  const metaTitle = title
    ? `${title} | ${dict.maps[map]} | palia.th.gl`
    : `${dict.maps[map]} | ${dict.meta.subtitle} | palia.th.gl`;

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
