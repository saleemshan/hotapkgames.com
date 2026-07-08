import type { MetadataRoute } from "next";

import { SITE_LOGO } from "@/lib/site-media";
import { siteConfig } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f1a",
    theme_color: "#ff6b35",
    lang: "en-PK",
    icons: [
      {
        src: SITE_LOGO.src,
        sizes: "120x80",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
