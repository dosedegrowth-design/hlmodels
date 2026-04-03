import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/marcas/", "/api/"],
      },
    ],
    sitemap: "https://hlmodels.vercel.app/sitemap.xml",
  };
}
