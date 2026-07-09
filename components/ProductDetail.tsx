"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/Toast";
import {
  ArrowLeft,
  ArrowUpRight,
  PlusIcon,
  MinusIcon,
} from "@/components/icons";
import { priceLabel, type Product } from "@/lib/products";

export default function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { add } = useCart();
  const toast = useToast();
  const [qty, setQty] = useState(1);
  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.img];
  const [activeImg, setActiveImg] = useState(0);

  function handleAdd() {
    add(product.slug, qty);
    toast.success(
      qty > 1
        ? `${qty} × ${product.name} added to your cart.`
        : `${product.name} added to your cart.`,
      "Added to cart"
    );
  }

  return (
    <>
      <Navbar />
      <main id="home" className="section-block bg-canvas pb-20 pt-28 sm:pt-32">
        <div className="container-fluid">
          {/* Breadcrumb / back */}
          <nav aria-label="Breadcrumb">
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 text-[14px] text-ink-secondary transition-colors hover:text-ink"
            >
              <ArrowLeft /> Back to the range
            </Link>
          </nav>

          {/* Two-column: image left, details right */}
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface-mute">
                <Image
                  src={gallery[activeImg] ?? product.img}
                  alt={`${product.name} — ${product.meta}`}
                  fill
                  priority
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-opacity duration-300"
                />
              </div>
              {gallery.length > 1 && (
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {gallery.map((src, i) => {
                    const isActive = i === activeImg;
                    return (
                      <button
                        key={src + i}
                        type="button"
                        aria-label={`View image ${i + 1} of ${gallery.length}`}
                        aria-current={isActive}
                        onClick={() => setActiveImg(i)}
                        className={`group relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-mute ring-1 transition-all sm:h-20 sm:w-24 ${
                          isActive
                            ? "ring-2 ring-ink"
                            : "ring-line hover:ring-ink/40"
                        }`}
                      >
                        <Image
                          src={src}
                          alt={`${product.name} view ${i + 1}`}
                          fill
                          sizes="96px"
                          className={`object-cover transition-opacity ${
                            isActive
                              ? "opacity-100"
                              : "opacity-90 group-hover:opacity-100"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <span className="inline-flex w-fit items-center gap-2 rounded-pill border border-line bg-white px-3 py-1 text-[10px] uppercase tracking-label text-ink-secondary">
                Peptiva Labs · {product.category}
              </span>
              <h1 className="mt-3 text-[clamp(24px,3vw,34px)] font-medium leading-[1.1] tracking-tight2 text-ink">
                {product.name}
              </h1>
              <p className="mt-1.5 text-[12px] uppercase tracking-label text-ink-muted">
                {product.meta}
              </p>
              <p className="mt-3 text-[20px] font-medium text-ink">
                {priceLabel(product)}
              </p>

              {product.description.map((p, i) => (
                <p
                  key={i}
                  className="mt-3 max-w-prose text-[14px] leading-relaxed text-ink-secondary"
                >
                  {p}
                </p>
              ))}

              {/* Quantity + add to cart */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-pill border border-line bg-white">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-canvas"
                  >
                    <MinusIcon width={16} height={16} />
                  </button>
                  <span
                    className="w-8 text-center text-[15px] font-medium"
                    aria-live="polite"
                  >
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => q + 1)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-canvas"
                  >
                    <PlusIcon width={16} height={16} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="btn-dark inline-flex items-center gap-2"
                >
                  Add to cart
                </button>

              </div>

              {/* Highlights */}
              <ul className="mt-6 grid grid-cols-1 gap-2 border-t border-line pt-4 sm:grid-cols-2">
                {product.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 text-[13px] text-ink-secondary"
                  >
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-none rounded-full bg-ink_btn" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <section className="mt-20 sm:mt-28" aria-labelledby="related-heading">
              <div className="flex items-end justify-between">
                <h2
                  id="related-heading"
                  className="text-[clamp(22px,2.6vw,32px)] font-medium tracking-tight2 text-ink"
                >
                  Related products
                </h2>
                <Link
                  href="/#products"
                  className="text-[14px] text-ink-secondary transition-colors hover:text-ink"
                >
                  View all
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/products/${r.slug}`}
                    className="group relative block overflow-hidden rounded-card bg-white"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-mute">
                      <Image
                        src={r.img}
                        alt={r.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3 border border-t-0 border-line p-5">
                      <div>
                        <h3 className="text-[16px] font-medium text-ink">
                          {r.name}
                        </h3>
                        <p className="mt-1 text-[13px] text-ink-secondary">
                          {priceLabel(r)}
                        </p>
                      </div>
                      <span className="arrow-btn transition-transform group-hover:rotate-45">
                        <ArrowUpRight />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
