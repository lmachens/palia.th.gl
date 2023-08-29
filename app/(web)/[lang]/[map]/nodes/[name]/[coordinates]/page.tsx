import { LOCALES } from "@/app/lib/i18n";
import { MAPS } from "@/app/lib/maps";

export default function Empty() {
  return <></>;
}

export async function generateStaticParams() {
  return LOCALES.flatMap((locale) => MAPS.map((map) => ({ locale, map })));
}
