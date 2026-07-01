import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { PRODUCTS } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static build timestamp is fine for a content-stable marketing site.
  const lastModified = new Date("2026-07-01");

  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  for (const product of PRODUCTS) {
    routes.push({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return routes;
}
