import { isOverwolf } from "@/lib/env";
import { LOCALES } from "@/lib/i18n";

export default function Embed() {
  return <></>;
}

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => {
    return {
      lang,
    };
  });
}

export const dynamic = isOverwolf ? "force-static" : "auto";
