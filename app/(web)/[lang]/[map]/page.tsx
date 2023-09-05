import { LOCALES } from "@/app/lib/i18n";
import { CONFIGS } from "@/app/lib/maps";

export default function Empty() {
  return <></>;
}

export async function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    Object.keys(CONFIGS).map((map) => ({ locale, map }))
  );
}
