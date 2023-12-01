import { isOverwolf } from "@/lib/env";
import { LOCALES, loadDictionary } from "@/lib/i18n";
import { CONFIGS } from "@/lib/maps";

export default function Empty() {
  return <></>;
}

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => {
    const dict = loadDictionary(lang);
    return Object.keys(CONFIGS).map((map) => {
      const mapName = dict.maps[map];
      return {
        lang,
        map: mapName,
      };
    });
  });
}

export const dynamic = isOverwolf ? "force-static" : "auto";
