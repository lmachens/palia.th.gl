import { isOverwolf } from "@/app/lib/env";
import { LOCALES } from "@/app/lib/i18n";

export default function Empty() {
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
