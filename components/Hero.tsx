"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

const HERO_IMAGES: { src: string; alt: string }[] = [
  {
    src: "/images/hero3-seo.webp",
    alt: "Cold-chain dispatch of verified research peptides from Peptiva Labs",
  },
  {
    src: "/images/hero1-seo.webp",
    alt: "Peptiva Labs research peptide pen sourced and shipped from Dubai",
  },
  {
    src: "/images/hero2-seo.webp",
    alt: "Lab-tested research peptide packaging by Peptiva Labs UAE",
  },
  {
    src: "/images/hero4-seo.webp",
    alt: "Third-party tested peptide pen ready for research use",
  },
];

// Individual letters so GSAP can stagger them into place. The giant hero
// mark uses the short brand "Peptiva" to keep the same visual scale — the
// full "Peptiva Labs" wordmark appears in the nav, footer, and inline copy.
const LETTERS = ["P", "e", "p", "t", "i", "v", "a"];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(
        "[data-hero-letter]",
        { y: 80, opacity: 0, duration: 1.1, stagger: 0.08 },
        0
      )
        .from(
          "[data-hero-img]",
          { y: 60, opacity: 0, duration: 1, stagger: 0.08 },
          0.5
        )
        .from(
          "[data-hero-foot]",
          { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 },
          0.9
        );

      // After the intro settles, let the hero images drift almost
      // imperceptibly — alternating direction for an organic, living feel.
      tl.eventCallback("onComplete", () => {
        gsap.utils.toArray<HTMLElement>("[data-hero-img]").forEach((img, i) => {
          gsap.to(img, {
            y: i % 2 === 0 ? -9 : -5,
            duration: 9 + i * 1.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.4,
          });
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={root}
      className="section-block pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16"
    >
      <div className="container-fluid">
        <h1 className="display text-center text-[clamp(80px,18vw,288px)]">
          {LETTERS.map((ch, i) => (
            <span
              key={i}
              data-hero-letter
              className="display-letter"
            >
              {ch}
            </span>
          ))}
        </h1>

        <div className="mt-8 sm:mt-10 flex items-end justify-center gap-2 sm:gap-3 md:gap-5">
          {HERO_IMAGES.map(({ src, alt }, i) => {
            const rotations = ["-rotate-6", "rotate-3", "-rotate-2", "rotate-6"];
            const offset = ["", "-mb-2 sm:-mb-4", "", "-mb-1 sm:-mb-2"];
            return (
              <div
                key={i}
                data-hero-img
                className={`relative w-[22%] sm:w-[24%] aspect-[3/4] ${offset[i]} ${rotations[i]} overflow-hidden rounded-image bg-surface-mute shadow-card`}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(min-width: 640px) 24vw, 22vw"
                  priority={i === 0}
                  className="object-cover"
                />
              </div>
            );
          })}
        </div>

        <div className="mt-10 sm:mt-14 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <p
            data-hero-foot
            className="max-w-md text-[14px] text-ink-secondary"
          >
            Verified research peptides, packed and dispatched from Dubai.
            Honest sourcing, careful handling, and a real person on WhatsApp
            when you need one.
          </p>
          <div data-hero-foot className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <a href="#products" className="btn-dark">
              Browse catalogue
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
