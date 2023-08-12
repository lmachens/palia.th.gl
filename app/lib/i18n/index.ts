import br from "./dictionaries/br.json";
import de from "./dictionaries/de.json";
import en from "./dictionaries/en.json";
import es from "./dictionaries/es.json";
import fr from "./dictionaries/fr.json";
import deGenerated from "./dictionaries/generated/de.json";
import { default as enGenerated } from "./dictionaries/generated/en.json";
import esGenerated from "./dictionaries/generated/es.json";
import frGenerated from "./dictionaries/generated/fr.json";
import ptGenerated from "./dictionaries/generated/pt.json";
import ruGenerated from "./dictionaries/generated/ru.json";
import ru from "./dictionaries/ru.json";

type GENERATED = Record<
  string,
  Record<string, { name: string; description?: string }>
>;
export type DICT =
  | (typeof en & {
      generated: GENERATED;
    })
  | (typeof de & {
      generated: GENERATED;
    })
  | (typeof es & {
      generated: GENERATED;
    })
  | (typeof fr & {
      generated: GENERATED;
    })
  | (typeof ru & {
      generated: GENERATED;
    })
  | (typeof br & {
      generated: GENERATED;
    });
const DICTIONARIES = {
  en: { ...en, generated: enGenerated },
  de: { ...de, generated: deGenerated },
  es: { ...es, generated: esGenerated },
  fr: { ...fr, generated: frGenerated },
  ru: { ...ru, generated: ruGenerated },
  br: { ...br, generated: ptGenerated },
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
