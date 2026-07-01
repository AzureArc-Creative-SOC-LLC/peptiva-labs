import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Transactional and account pages carry no indexable value.
        disallow: [
          "/cart",
          "/checkout",
          "/account",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/track-order",
          "/orders/",
          "/payment-capture/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
