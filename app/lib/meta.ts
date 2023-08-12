import { Metadata } from "next";
import { API_BASE_URI } from "./env";
import { DEFAULT_LOCALE, LOCALES, loadDictionary } from "./i18n";
import { nodes } from "./nodes";
import { getTerritoryByPoint } from "./territories";

export function generateMetadata({
  params: { lang = DEFAULT_LOCALE, name },
}: {
  params: { lang: string; name: string };
}): Metadata {
  const dict = loadDictionary(lang);
  const title = name ? decodeURIComponent(name) : "Sanctuary";

  const node = nodes.find((node) =>
    "name" in node ? node.name : node.type === title,
  );
  const type = node?.type;

  let description = dict.meta.description;
  if (node) {
    const territory = getTerritoryByPoint([node.x, node.y]);
    description = "name" in node ? node.name : "";
    if (type) {
      description += ` (${dict.nodes[type]})`;
    }
    if (territory) {
      description += ` in ${dict.territories[territory.id]}`;
    }
    if ("description" in node) {
      description += `. ${node.description?.replace(/<\/?[^>]+(>|$)/g, "")}`;
    }
  }

  let canonical = API_BASE_URI + (lang === DEFAULT_LOCALE ? "" : `/${lang}`);
  if (name) {
    canonical += `/nodes/${name}`;
  }
  const alternativeLanguages = LOCALES.reduce(
    (acc, locale) => {
      acc[locale] = API_BASE_URI + `/${locale}`;
      if (name) {
        acc[locale] += `/nodes/${name}`;
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  return {
    title: `${title} | ${dict.meta.subtitle} | diablo4.th.gl`,
    description: description,
    creator: "Leon Machens",
    themeColor: "black",
    alternates: {
      canonical: canonical,
      languages: alternativeLanguages,
    },
    twitter: {
      card: "summary_large_image",
    },
    openGraph: {
      title: `Sanctuary | ${dict.meta.subtitle} | diablo4.th.gl`,
      description: description,
      type: name ? "article" : "website",
      url: "https://diablo4.th.gl",
    },
  };
}
