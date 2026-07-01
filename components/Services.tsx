"use client";

import Link from "next/link";
import Image from "next/image";
import { useReveal } from "./useReveal";
import { ArrowUpRight } from "./icons";
import { PRODUCTS, priceLabel } from "@/lib/products";

export default function Services() {
  const scope = useReveal<HTMLDivElement>();
  return (
    <section id="products" className="section-block bg-canvas py-12 sm:py-16 md:py-24">
      <div ref={scope} className="container-fluid">
        <div className="mx-auto max-w-2xl text-center">
          <h2 data-reveal className="reveal-init text-h2 font-normal">
            The Range
          </h2>
          <p
            data-reveal
            className="reveal-init mt-4 text-[14px] text-ink-secondary"
          >
            Four core peptide lines, each available in the concentrations
            researchers actually ask for. Every batch is verified, sealed, and
            cold-shipped from our Dubai facility.
          </p>
        </div>

        <div className="mt-10 sm:mt-16 grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((s) => (
            <Link
              key={s.slug}
              href={`/products/${s.slug}`}
              data-reveal
              className="reveal-init group block overflow-hidden rounded-card border border-line bg-white transition-shadow duration-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-mute">
                <Image
                  src={s.img}
                  alt={s.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className={`flex flex-col p-5 ${s.bg}`}>
                <p className="text-[11px] uppercase tracking-label text-ink-muted">
                  {s.meta}
                </p>
                <h3 className="mt-1.5 text-[17px] font-medium leading-tight text-ink">
                  {s.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-ink-secondary">
                  {s.blurb}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[14px] font-medium text-ink">
                    {priceLabel(s)}
                  </span>
                  <span className="arrow-btn transition-transform group-hover:rotate-45">
                    <ArrowUpRight />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
