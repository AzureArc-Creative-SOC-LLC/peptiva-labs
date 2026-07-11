// Central SEO configuration and structured-data (JSON-LD) helpers.
//
// The canonical origin is configurable via NEXT_PUBLIC_SITE_URL so the same
// build can be promoted across preview/production without hard-coding a host.

import type { Metadata } from "next";
import { PRODUCTS, type Product, formatAED } from "./products";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://peptivalabs.com"
).replace(/\/$/, "");

export const SITE_NAME = "Peptiva Labs";

export const SITE_DESCRIPTION =
  "Lab-grade research peptides sourced, sealed and dispatched from Dubai across the UAE. Verified sourcing, cold-chain handling, and direct WhatsApp support on every order.";

export const CONTACT = {
  whatsapp: "+971543800625",
  whatsappHref: "https://wa.me/971543800625",
  email: "sales@peptivalabs.com",
  city: "Dubai",
  country: "AE",
};

// Default social card inherited by every route that doesn't pass its own
// image (product routes override it with the product photo).
export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/images/research2.jpg`,
  width: 600,
  height: 400,
  alt: "Peptiva Labs — research peptides sourced and shipped from Dubai",
};

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Shared metadata factory so every route gets consistent canonical URLs,
 * Open Graph and Twitter cards without repeating boilerplate.
 */
export function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  images,
  noindex = false,
  keywords,
}: {
  title: string;
  description?: string;
  path?: string;
  images?: { url: string; width?: number; height?: number; alt?: string }[];
  noindex?: boolean;
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const ogImages = images ?? [DEFAULT_OG_IMAGE];
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url,
      locale: "en_AE",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((i) => i.url),
    },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD structured data
// ---------------------------------------------------------------------------

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    image: DEFAULT_OG_IMAGE.url,
    description: SITE_DESCRIPTION,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: CONTACT.whatsapp,
      email: CONTACT.email,
      areaServed: "AE",
      availableLanguage: ["en"],
    },
    sameAs: [CONTACT.whatsappHref],
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${SITE_URL}/#store`,
    name: SITE_NAME,
    url: SITE_URL,
    image: DEFAULT_OG_IMAGE.url,
    logo: `${SITE_URL}/icon.svg`,
    description: SITE_DESCRIPTION,
    telephone: CONTACT.whatsapp,
    email: CONTACT.email,
    priceRange: "AED",
    currenciesAccepted: "AED",
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Level 5, Business Bay",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-AE",
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.blurb,
    category: product.category,
    image: (product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.img]
    ).map((src) => absoluteUrl(src)),
    brand: { "@type": "Brand", name: SITE_NAME },
    sku: product.slug,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: "AED",
      price: product.price,
      availability: "https://schema.org/InStock",
      priceValidUntil: "2026-12-31",
      seller: { "@id": `${SITE_URL}/#organization` },
      // Human-readable label kept for parity with the on-page price.
      description: `${product.from ? "from " : ""}${formatAED(product.price)}`,
    },
  };
}

/** Serialise a schema object for safe embedding in a <script> tag. */
export function jsonLd(data: unknown): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

/** All product URLs, used by the sitemap. */
export function productUrls(): string[] {
  return PRODUCTS.map((p) => absoluteUrl(`/products/${p.slug}`));
}
