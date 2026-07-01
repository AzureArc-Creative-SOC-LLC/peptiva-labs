"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Editorial masked line reveal.
 *
 * Section titles (`h2`) are split into lines with GSAP SplitText (masked),
 * and each line rises from behind its clip mask — bottom to top — while its
 * blur reduces to zero, on a long Power4.out with a line-by-line stagger.
 * Original markup (italics, <br/>) is preserved by SplitText.
 *
 * All other `data-reveal` elements (cards, paragraphs, media, stats) use a
 * softer staggered fade-up. Everything fires once at `top 85%`, uses
 * transform/opacity/filter only, and is disabled under reduced motion.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const scope = useRef<T>(null);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let ctx: gsap.Context | undefined;
    const splits: SplitText[] = [];
    let cancelled = false;

    const build = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        // --- 1. Editorial masked line reveal for section titles ----------
        gsap.utils.toArray<HTMLElement>("h2").forEach((h) => {
          const split = new SplitText(h, {
            type: "lines",
            mask: "lines",
            linesClass: "rv-line",
          });
          splits.push(split);

          gsap.set(split.lines, {
            yPercent: 115,
            opacity: 0,
            filter: "blur(8px)",
          });
          gsap.to(split.lines, {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power4.out",
            stagger: 0.12,
            clearProps: "filter",
            scrollTrigger: { trigger: h, start: "top 85%", once: true },
          });
        });

        // --- 2. Curtain image reveal -------------------------------------
        // The inner <img> is unveiled with a bottom-to-top clip-path wipe
        // while it settles from a slight zoom. The rounded, overflow-hidden
        // container masks the corners so the curtain stays inside the card.
        gsap.utils.toArray<HTMLElement>("[data-img-reveal]").forEach((el) => {
          const img = el.querySelector("img");
          if (!img) return;
          gsap.set(img, {
            clipPath: "inset(100% 0% 0% 0%)",
            scale: 1.16,
            transformOrigin: "50% 50%",
          });
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
          tl.to(
            img,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.3,
              ease: "power4.out",
              clearProps: "clipPath",
            },
            0
          ).to(img, { scale: 1, duration: 1.5, ease: "power3.out" }, 0);
        });

        // --- 3. Staggered fade-up for everything else --------------------
        const items = gsap
          .utils
          .toArray<HTMLElement>("[data-reveal]")
          .filter(
            (el) => el.tagName !== "H2" && !el.hasAttribute("data-img-reveal")
          );
        if (items.length) {
          items.forEach((el) => gsap.set(el, { autoAlpha: 0, y: 30 }));
          ScrollTrigger.batch(items, {
            start: "top 85%",
            once: true,
            onEnter: (batch) => {
              batch.forEach((node, i) => {
                gsap.to(node, {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.9,
                  ease: "power3.out",
                  delay: i * 0.09,
                  clearProps: "transform",
                });
              });
            },
          });
        }

        ScrollTrigger.refresh();
      }, root);
    };

    // Split only once webfonts are ready, so line breaks are measured right.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(build);
    } else {
      build();
    }

    return () => {
      cancelled = true;
      ctx?.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  return scope;
}
