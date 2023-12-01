import { isOverwolf } from "@/lib/env";

export { generateMetadata } from "@/lib/meta";

export default function Node() {
  return <></>;
}

export function generateStaticParams() {
  return [
    {
      lang: "en",
      map: "Kilima Valley",
      name: "Test",
      coordinates: "@0,0",
    },
  ];
}

export const dynamic = isOverwolf ? "force-static" : "auto";
