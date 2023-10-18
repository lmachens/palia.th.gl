import { isOverwolf } from "@/app/lib/env";
import { LOCALES, loadDictionary } from "@/app/lib/i18n";
import { CONFIGS } from "@/app/lib/maps";

export { generateMetadata } from "@/app/lib/meta";

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
export const maxDuration = 30;
