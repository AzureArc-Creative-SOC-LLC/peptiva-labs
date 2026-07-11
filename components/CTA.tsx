"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const CARDS = [
  {
    src: "/images/circle-img-seo1.webp",
    alt: "Research peptide vial from Peptiva Labs Dubai catalogue",
    pos: "top-[7%] left-[8%] w-[92px] h-[116px] sm:w-[126px] sm:h-[160px]",
    tilt: -8,
  },
  {
    src: "/images/circle-img-seo2.webp",
    alt: "Lab-tested BPC-157 research peptide by Peptiva Labs",
    pos: "top-[4%] right-[8%] w-[96px] h-[120px] sm:w-[134px] sm:h-[168px]",
    tilt: 7,
  },
  {
    src: "/images/circle-img3-seo.webp",
    alt: "Tirzepatide research peptide vial stocked in the UAE",
    pos: "top-[39%] left-0 sm:left-[1%] w-[86px] h-[108px] sm:w-[118px] sm:h-[150px]",
    tilt: -5,
  },
  {
    src: "/images/circle-img4-seo-new.webp",
    alt: "Retatrutide research peptide from Peptiva Labs",
    pos: "top-[41%] right-0 sm:right-[1%] w-[86px] h-[108px] sm:w-[118px] sm:h-[150px]",
    tilt: 6,
  },
  {
    src: "/images/circle-img5.webp",
    alt: "Glow peptide blend for skin and tissue research",
    pos: "bottom-[7%] left-[11%] w-[92px] h-[116px] sm:w-[126px] sm:h-[160px]",
    tilt: 5,
  },
  {
    src: "/images/circle-img6-seo.webp",
    alt: "Sealed research peptide vial ready for cold-chain dispatch",
    pos: "bottom-[4%] right-[11%] w-[92px] h-[116px] sm:w-[126px] sm:h-[160px]",
    tilt: -7,
  },
];

const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export default function CTA() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const stageEl = stage.current;
    if (!el || !stageEl) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const circles = gsap.utils.toArray<HTMLElement>(".orbit-circle");
      const cards = gsap.utils.toArray<HTMLElement>(".orbit-card");
      const inners = gsap.utils.toArray<HTMLElement>(".orbit-card-inner");
      const glow = el.querySelector<HTMLElement>(".orbit-glow");
      const head = el.querySelector<HTMLElement>(".orbit-head");
      const cta = el.querySelector<HTMLElement>(".orbit-cta");
      const cardsWrap = el.querySelector<HTMLElement>(".orbit-cards");
      const circlesWrap = el.querySelector<HTMLElement>(".orbit-circles");

      if (reduce) return; // leave everything in its natural, visible state

      // Center deltas — how far each card must travel back to the center.
      const sr = stageEl.getBoundingClientRect();
      const cx = sr.left + sr.width / 2;
      const cy = sr.top + sr.height / 2;
      const deltas = cards.map((c) => {
        const r = c.getBoundingClientRect();
        return {
          dx: cx - (r.left + r.width / 2),
          dy: cy - (r.top + r.height / 2),
        };
      });

      // Initial (collapsed-at-center) states
      gsap.set(circles, { scale: 0.6, autoAlpha: 0, transformOrigin: "50% 50%" });
      if (glow) gsap.set(glow, { scale: 0.6, autoAlpha: 0 });
      cards.forEach((c, i) => {
        gsap.set(c, {
          x: deltas[i].dx,
          y: deltas[i].dy,
          scale: 0.3,
          autoAlpha: 0,
          rotation: gsap.utils.random(-24, 24),
          filter: "blur(10px)",
          transformOrigin: "50% 50%",
        });
      });
      // Editorial masked line reveal for the heading (matches all sections)
      const headSplit = head
        ? new SplitText(head, {
            type: "lines",
            mask: "lines",
            linesClass: "rv-line",
          })
        : null;
      if (headSplit) {
        gsap.set(headSplit.lines, {
          yPercent: 115,
          opacity: 0,
          filter: "blur(8px)",
        });
      }
      gsap.set(cta, { autoAlpha: 0, y: 22 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" }, // ≈ cubic-bezier(.22,1,.36,1)
        scrollTrigger: { trigger: el, start: "top 78%", once: true },
        onComplete: startAmbient,
      });

      if (glow) tl.to(glow, { scale: 1, autoAlpha: 1, duration: 1.4 }, 0);
      tl.to(circles, { scale: 1, autoAlpha: 1, duration: 1.4, stagger: 0.12 }, 0);
      tl.to(
        cards,
        {
          x: 0,
          y: 0,
          scale: 1,
          autoAlpha: 1,
          filter: "blur(0px)",
          rotation: (i: number) => CARDS[i].tilt,
          duration: 1.1,
          ease: "back.out(1.4)", // overshoot then settle
          stagger: 0.15,
        },
        0.35
      );
      if (headSplit) {
        tl.to(
          headSplit.lines,
          {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.12,
            clearProps: "filter",
          },
          0.9
        );
      }
      tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.6 }, 1.25);

      function startAmbient() {
        // Concentric circles — subtle infinite pulse
        circles.forEach((c, i) => {
          gsap.to(c, {
            scale: 1.05,
            duration: gsap.utils.random(6, 10),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.5,
          });
        });
        if (glow)
          gsap.to(glow, {
            scale: 1.1,
            autoAlpha: 0.8,
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        // Cards — continuous organic float (on the inner layer so it never
        // fights the entrance transform on the outer element)
        inners.forEach((c) => {
          gsap.to(c, {
            y: gsap.utils.random(-10, -6),
            rotation: gsap.utils.random(-2, 2),
            duration: gsap.utils.random(4, 6),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: gsap.utils.random(0, 1.5),
          });
        });
      }

      // Subtle parallax on pointer move (layers drift at different rates)
      const cardX = gsap.quickTo(cardsWrap, "x", { duration: 0.7, ease: "power3.out" });
      const cardY = gsap.quickTo(cardsWrap, "y", { duration: 0.7, ease: "power3.out" });
      const circX = gsap.quickTo(circlesWrap, "x", { duration: 0.9, ease: "power3.out" });
      const circY = gsap.quickTo(circlesWrap, "y", { duration: 0.9, ease: "power3.out" });
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        cardX(px * 22);
        cardY(py * 22);
        circX(px * 9);
        circY(py * 9);
      };
      el.addEventListener("mousemove", onMove);
      return () => el.removeEventListener("mousemove", onMove);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative w-full overflow-hidden bg-canvas py-20 sm:py-28"
    >
      {/* Grain / noise overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-40 opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: `url("${GRAIN}")`, backgroundSize: "140px 140px" }}
      />

      <div className="container-fluid">
        <div
          ref={stage}
          className="relative mx-auto h-[520px] max-w-4xl sm:h-[540px]"
        >
          {/* Radial glow */}
          <div
            aria-hidden
            className="orbit-glow pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(49,41,56,0.12) 0%, rgba(49,41,56,0.04) 35%, transparent 65%)",
            }}
          />

          {/* Concentric circles */}
          <div className="orbit-circles pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
            {[1, 2, 3, 4].map((r) => (
              <div
                key={r}
                className="orbit-circle absolute rounded-full border border-ink/10"
                style={{
                  width: `clamp(${r * 80}px, ${r * 20}vw, ${r * 150}px)`,
                  height: `clamp(${r * 80}px, ${r * 20}vw, ${r * 150}px)`,
                }}
              />
            ))}
          </div>

          {/* Floating image cards */}
          <div className="orbit-cards absolute inset-0 z-10">
            {CARDS.map((c, i) => (
              <div
                key={i}
                className={`orbit-card absolute ${c.pos}`}
                style={{ willChange: "transform, opacity, filter" }}
              >
                <div className="orbit-card-inner h-full w-full" style={{ willChange: "transform" }}>
                  <div className="group relative h-full w-full overflow-hidden rounded-image bg-surface-mute shadow-card transition-[transform,box-shadow] duration-300 hover:z-30 hover:scale-105 hover:shadow-[0_24px_50px_-12px_rgba(15,23,42,0.35)]">
                    <Image
                      src={c.src}
                      alt={c.alt}
                      fill
                      sizes="168px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Center content */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
            <h2 className="orbit-head text-h2 font-normal text-balance">
              Ready to order?
              <br /> Browse the catalogue
            </h2>
            <a
              id="contact"
              href="/#products"
              className="orbit-cta btn-dark mt-5 transition-[transform,box-shadow] duration-300 hover:scale-[1.05] hover:shadow-[0_16px_40px_-10px_rgba(26,29,32,0.55)] sm:mt-6"
            >
              Start your order
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
