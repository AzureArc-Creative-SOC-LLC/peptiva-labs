"use client";

import { useState } from "react";
import Image from "next/image";
import { useReveal } from "./useReveal";
import { QuoteIcon } from "./icons";

const TESTIMONIALS = [
  {
    quote:
      "Ordered late afternoon, dispatched the next morning, and the packaging was easily the cleanest I've seen from a UAE supplier. Replies on WhatsApp arrived in minutes.",
    name: "Hassan Al Marri",
    role: "Independent researcher, Abu Dhabi",
    img: "/images/review-img1-seo.webp",
  },
  {
    quote:
      "I've worked with three different peptide vendors. Peptiva Labs is the only one that has been consistent on purity, stock, and after-sales communication every single order.",
    name: "Dr. Aisha Khan",
    role: "Clinical research coordinator",
    img: "/images/review-img2-seo.webp",
  },
  {
    quote:
      "Their team walked me through concentration choices before I bought anything. No upsell, no pressure — just useful guidance. That's rare in this space.",
    name: "Yusuf Rahman",
    role: "Performance coach, Dubai",
    img: "/images/review-img3-seo.webp",
  },
];

export default function Testimonials() {
  const scope = useReveal<HTMLDivElement>();
  const [index, setIndex] = useState(0);
  const t = TESTIMONIALS[index];

  return (
    <section id="testimonial" className="section-block bg-canvas py-12 sm:py-16 md:py-24">
      <div ref={scope} className="container-fluid">
        <h2
          data-reveal
          className="reveal-init text-center text-h2 font-normal"
        >
          What our customers say
        </h2>

        <div
          data-reveal
          className="reveal-init mx-auto mt-8 sm:mt-12 grid max-w-4xl grid-cols-1 overflow-hidden rounded-card bg-surface-soft md:grid-cols-[260px_1fr]"
        >
          <div
            data-img-reveal
            className="relative aspect-[5/4] overflow-hidden md:aspect-auto md:h-full"
          >
            <Image
              src={t.img}
              alt={`${t.name}, ${t.role}`}
              fill
              sizes="(min-width: 768px) 260px, 100vw"
              className="object-cover"
            />
          </div>
          <figure className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
            <span className="text-ink/20">
              <QuoteIcon />
            </span>
            <blockquote className="mt-3 text-[17px] sm:text-[20px] leading-snug text-ink">
              {t.quote}
            </blockquote>
            <figcaption className="mt-4 sm:mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[15px] font-medium text-ink">{t.name}</span>
              <span className="text-[13px] text-ink-muted">{t.role}</span>
            </figcaption>
          </figure>
        </div>

        <div className="mt-6 flex justify-center">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Testimonial ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className="group inline-flex h-6 w-6 items-center justify-center"
            >
              <span
                aria-hidden
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i === index ? "bg-ink" : "bg-ink/20 group-hover:bg-ink/40"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
