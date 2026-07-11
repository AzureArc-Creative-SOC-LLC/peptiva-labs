"use client";

import Image from "next/image";
import { useReveal } from "./useReveal";

const CASES = [
  {
    img: "/images/source-seo.webp",
    alt: "Sourcing research peptides directly from certified manufacturers for Peptiva Labs Dubai",
    step: "01 · Source",
    quote:
      "Direct contracts with certified manufacturers. No grey-market resellers in the chain.",
    bg: "bg-lilac",
  },
  {
    img: "/images/verify-seo.webp",
    alt: "Independent purity verification of every research peptide batch at Peptiva Labs",
    step: "02 · Verify",
    quote:
      "Independent purity and concentration checks on every batch before it touches a customer order.",
    bg: "bg-cream",
  },
  {
    img: "/images/ship-seo.webp",
    alt: "Cold-chain shipping of sealed research peptide vials across the UAE",
    step: "03 · Ship",
    quote:
      "Cold-packed, tamper-sealed, and dispatched same or next day from our Dubai warehouse.",
    bg: "bg-surface-mute",
  },
];

export default function CaseStudy() {
  const scope = useReveal<HTMLDivElement>();
  return (
    <section id="process" className="section-block bg-canvas py-12 sm:py-16 md:py-24">
      <div ref={scope} className="container-fluid">
        <div className="mx-auto max-w-2xl text-center">
          <h2 data-reveal className="reveal-init text-h2 font-normal text-balance">
            How a vial gets to you
          </h2>
          <p
            data-reveal
            className="reveal-init mt-4 text-[14px] text-ink-secondary"
          >
            Three deliberate steps between the lab bench and your doorstep —
            so nothing about the product is left to chance.
          </p>
        </div>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
          {CASES.map((c, i) => (
            <article
              key={i}
              data-reveal
              className={`reveal-init overflow-hidden rounded-card ${c.bg}`}
            >
              <div data-img-reveal className="relative aspect-[5/4] overflow-hidden">
                <Image
                  src={c.img}
                  alt={c.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="px-5 py-4 sm:px-6 sm:py-5">
                <p className="text-[12px] uppercase tracking-label text-ink-muted">
                  {c.step}
                </p>
                <p className="mt-2 text-[14px] sm:text-[15px] leading-snug text-ink">
                  {c.quote}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
