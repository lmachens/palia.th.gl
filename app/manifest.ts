import { MetadataRoute } from "next";
import { loadDictionary } from "./lib/i18n";

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
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
