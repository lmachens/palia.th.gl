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
import { default as jaDBGenerated } from "./dictionaries/generated/ja.db.json";
import { default as jaGenerated } from "./dictionaries/generated/ja.json";
import { default as jaSpawnNodesGenerated } from "./dictionaries/generated/ja.spawn-nodes.json";
import { default as koDBGenerated } from "./dictionaries/generated/ko.db.json";
import { default as koGenerated } from "./dictionaries/generated/ko.json";
import { default as koSpawnNodesGenerated } from "./dictionaries/generated/ko.spawn-nodes.json";
import { default as ptBrDBGenerated } from "./dictionaries/generated/pt-br.db.json";
import { default as ptBrGenerated } from "./dictionaries/generated/pt-br.json";
import { default as ptBrSpawnNodesGenerated } from "./dictionaries/generated/pt-br.spawn-nodes.json";
import { default as ruDBGenerated } from "./dictionaries/generated/ru.db.json";
import { default as ruGenerated } from "./dictionaries/generated/ru.json";
import { default as ruSpawnNodesGenerated } from "./dictionaries/generated/ru.spawn-nodes.json";
import { default as zhHansDBGenerated } from "./dictionaries/generated/zh-hans.db.json";
import { default as zhHansGenerated } from "./dictionaries/generated/zh-hans.json";
import { default as zhHansSpawnNodesGenerated } from "./dictionaries/generated/zh-hans.spawn-nodes.json";
import { default as zhHantDBGenerated } from "./dictionaries/generated/zh-hant.db.json";
import { default as zhHantGenerated } from "./dictionaries/generated/zh-hant.json";
import { default as zhHantSpawnNodesGenerated } from "./dictionaries/generated/zh-hant.spawn-nodes.json";
import ja from "./dictionaries/ja.json";
import ko from "./dictionaries/ko.json";
import ptBr from "./dictionaries/pt-br.json";
import zhHans from "./dictionaries/zh-hans.json";
import zhHant from "./dictionaries/zh-hant.json";

import it from "./dictionaries/it.json";
import ru from "./dictionaries/ru.json";

export type DICT = {
  [key: string]: any;
};

const DICTIONARIES: {
  en: DICT;
  de: DICT;
  es: DICT;
  fr: DICT;
  it: DICT;
  ru: DICT;
  ja: DICT;
  ko: DICT;
  "pt-br": DICT;
  "zh-hans": DICT;
  "zh-hant": DICT;
} = {
  en: { ...en, generated: enGenerated, spawnNodes: enSpawnNodesGenerated },
  de: { ...de, generated: deGenerated, spawnNodes: deSpawnNodesGenerated },
  es: { ...es, generated: esGenerated, spawnNodes: esSpawnNodesGenerated },
  fr: { ...fr, generated: frGenerated, spawnNodes: frSpawnNodesGenerated },
  it: { ...it, generated: itGenerated, spawnNodes: itSpawnNodesGenerated },
  ru: { ...ru, generated: ruGenerated, spawnNodes: ruSpawnNodesGenerated },
  ja: { ...ja, generated: jaGenerated, spawnNodes: jaSpawnNodesGenerated },
  ko: { ...ko, generated: koGenerated, spawnNodes: koSpawnNodesGenerated },
  "pt-br": {
    ...ptBr,
    generated: ptBrGenerated,
    spawnNodes: ptBrSpawnNodesGenerated,
  },
  "zh-hans": {
    ...zhHans,
    generated: zhHansGenerated,
    spawnNodes: zhHansSpawnNodesGenerated,
  },
  "zh-hant": {
    ...zhHant,
    generated: zhHantGenerated,
    spawnNodes: zhHantSpawnNodesGenerated,
  },
};

const DB_DICTIONARIES: {
  en: DICT;
  de: DICT;
  es: DICT;
  fr: DICT;
  it: DICT;
  ru: DICT;
  ja: DICT;
  ko: DICT;
  "pt-br": DICT;
  "zh-hans": DICT;
  "zh-hant": DICT;
} = {
  en: enDBGenerated,
  de: deDBGenerated,
  es: esDBGenerated,
  fr: frDBGenerated,
  it: itDBGenerated,
  ru: ruDBGenerated,
  ja: jaDBGenerated,
  ko: koDBGenerated,
  "pt-br": ptBrDBGenerated,
  "zh-hans": zhHansDBGenerated,
  "zh-hant": zhHantDBGenerated,
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
