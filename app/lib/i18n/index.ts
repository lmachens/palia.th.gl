import en from "./dictionaries/en.json";
import { default as enGenerated } from "./dictionaries/generated/en.json";

type GENERATED = Record<
  string,
  Record<string, { name: string; description?: string }>
>;
export type DICT =
  | typeof en & {
      generated: GENERATED;
    };

const DICTIONARIES = {
  en: { ...en, generated: enGenerated },
} as const;

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
