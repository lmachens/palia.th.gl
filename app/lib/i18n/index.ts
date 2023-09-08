import de from "./dictionaries/de.json";
import en from "./dictionaries/en.json";
import es from "./dictionaries/es.json";
import fr from "./dictionaries/fr.json";
import { default as deDBGenerated } from "./dictionaries/generated/de.db.json";
import { default as deGenerated } from "./dictionaries/generated/de.json";
import { default as deSpawnNodesGenerated } from "./dictionaries/generated/de.spawn-nodes.json";
import { default as enDBGenerated } from "./dictionaries/generated/en.db.json";
import { default as enGenerated } from "./dictionaries/generated/en.json";
import { default as enSpawnNodesGenerated } from "./dictionaries/generated/en.spawn-nodes.json";
import { default as esDBGenerated } from "./dictionaries/generated/es.db.json";
import { default as esGenerated } from "./dictionaries/generated/es.json";
import { default as esSpawnNodesGenerated } from "./dictionaries/generated/es.spawn-nodes.json";
import { default as frDBGenerated } from "./dictionaries/generated/fr.db.json";
import { default as frGenerated } from "./dictionaries/generated/fr.json";
import { default as frSpawnNodesGenerated } from "./dictionaries/generated/fr.spawn-nodes.json";
import { default as itDBGenerated } from "./dictionaries/generated/it.db.json";
import { default as itGenerated } from "./dictionaries/generated/it.json";
import { default as itSpawnNodesGenerated } from "./dictionaries/generated/it.spawn-nodes.json";
import it from "./dictionaries/it.json";

export type DICT = {
  [key: string]: any;
};

const DICTIONARIES: {
  en: DICT;
  de: DICT;
  es: DICT;
  fr: DICT;
  it: DICT;
} = {
  en: { ...en, generated: enGenerated, spawnNodes: enSpawnNodesGenerated },
  de: { ...de, generated: deGenerated, spawnNodes: deSpawnNodesGenerated },
  es: { ...es, generated: esGenerated, spawnNodes: esSpawnNodesGenerated },
  fr: { ...fr, generated: frGenerated, spawnNodes: frSpawnNodesGenerated },
  it: { ...it, generated: itGenerated, spawnNodes: itSpawnNodesGenerated },
};

const DB_DICTIONARIES: {
  en: DICT;
  de: DICT;
  es: DICT;
  fr: DICT;
  it: DICT;
} = {
  en: enDBGenerated,
  de: deDBGenerated,
  es: esDBGenerated,
  fr: frDBGenerated,
  it: itDBGenerated,
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

export const loadDBDictionary = (lang = DEFAULT_LOCALE) => {
  if (!isLang(lang)) {
    return enDBGenerated;
  }

  return DB_DICTIONARIES[lang as keyof typeof DB_DICTIONARIES];
};
