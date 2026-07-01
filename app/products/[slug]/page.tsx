import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import {
  PRODUCTS,
  getProduct,
  relatedProducts,
  priceLabel,
} from "@/lib/products";
import {
  buildMetadata,
  absoluteUrl,
  breadcrumbSchema,
  productSchema,
  jsonLd,
} from "@/lib/seo";

// Pre-render every product at build time for instant, crawlable pages.
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = getProduct(params.slug);
  if (!product) {
    return buildMetadata({
      title: "Product not found",
      path: `/products/${params.slug}`,
      noindex: true,
    });
  }
  return buildMetadata({
    title: `${product.name} — ${product.meta}`,
    description: `${product.blurb} ${priceLabel(product)}. Verified, sealed and dispatched from Dubai.`,
    path: `/products/${product.slug}`,
    keywords: [
      product.name,
      `${product.name} Dubai`,
      `${product.name} UAE`,
      product.category,
      "research peptides",
    ],
    images: [
      {
        url: absoluteUrl(product.img),
        width: 1200,
        height: 900,
        alt: `${product.name} — ${product.meta}`,
      },
    ],
  });
}

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const related = relatedProducts(product.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(productSchema(product))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Products", path: "/#products" },
            { name: product.name, path: `/products/${product.slug}` },
          ])
        )}
      />
      <ProductDetail product={product} related={related} />
    </>
  );
}
