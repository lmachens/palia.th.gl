import en from "./dictionaries/en.json";
import { default as enGenerated } from "./dictionaries/generated/en.json";
import { default as enSpawnNodesGenerated } from "./dictionaries/generated/en.spawn-nodes.json";

export type DICT = {
  [key: string]: any;
};

const DICTIONARIES: {
  en: DICT;
} = {
  en: { ...en, generated: enGenerated, spawnNodes: enSpawnNodesGenerated },
};

export const LOCALES = Object.keys(DICTIONARIES);
export const DEFAULT_LOCALE = "en";

export const isLang = (lang?: string) => {
  return typeof lang !== "undefined" && LOCALES.includes(lang);
};

export const loadDictionary = (lang = DEFAULT_LOCALE) => {
  if (!isLang(lang)) {
    return DICTIONARIES[DEFAULT_LOCALE];
  }

  return DICTIONARIES[lang as keyof typeof DICTIONARIES];
};
