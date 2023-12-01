import { loadDictionary } from "@/lib/i18n";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const dict = loadDictionary();

  return {
    name: dict.meta.title,
    short_name: dict.meta.title,
    description: dict.meta.description,
    start_url: "/",
    display: "standalone",
    background_color: "#000",
    theme_color: "#000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
