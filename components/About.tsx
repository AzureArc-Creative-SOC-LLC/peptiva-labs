"use client";

import type { ComponentType, SVGProps } from "react";
import Image from "next/image";
import { useReveal } from "./useReveal";
import CountUp from "./CountUp";
import {
  ArrowRight,
  VialIcon,
  TruckIcon,
  CoachIcon,
  ShieldIcon,
} from "./icons";

const BRAND = "#1A1D20"; // project ink_btn — matches site CTAs and footer accent

const SERVICES = [
  "Third-party tested for purity",
  "Direct-from-supplier sourcing",
  "Accurate labelling on every vial",
  "Cold-chain UAE-wide dispatch",
];

const STATS: {
  value: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { value: "99.4%", label: "Verified Peptide Purity", Icon: ShieldIcon },
  { value: "5,000+", label: "Vials Shipped UAE-Wide", Icon: TruckIcon },
  { value: "8+", label: "Curated Peptide Lines", Icon: VialIcon },
  { value: "4,000+", label: "Researchers Served", Icon: CoachIcon },
];

function Check() {
  return (
    <span
      className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full text-white"
      style={{ backgroundColor: BRAND }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 12.5l4 4 10-10"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function About() {
  const scope = useReveal<HTMLDivElement>();

  return (
    <section id="about" className="section-block py-16 sm:py-20 md:py-28">
      <div ref={scope} className="container-fluid">
        {/* Top — two columns */}
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Left — floating laboratory collage */}
          <div data-reveal className="reveal-init">
            {/* Proportional box: 520×520 (280×330 + 280×260 with 70px overlap) */}
            <div className="relative mx-auto aspect-square w-full max-w-[520px] md:mx-0">
              {/* Top image — 350×310, top-left */}
              <div data-img-reveal className="absolute left-0 top-0 z-0 h-[59.62%] w-[67.31%] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-20px_rgba(15,23,42,0.28)]">
                <Image
                  src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80"
                  alt="Researcher pipetting samples in a Dubai lab"
                  fill
                  sizes="(min-width: 768px) 35vw, 68vw"
                  className="object-cover"
                />
              </div>

              {/* Bottom image — 320×260, bottom-right, 70px overlap */}
              <div data-img-reveal className="absolute bottom-0 right-0 z-10 h-[50%] w-[61.54%] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-20px_rgba(15,23,42,0.28)]">
                <Image
                  src="https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=800&auto=format&fit=crop&q=80"
                  alt="Laboratory flask and test tubes"
                  fill
                  sizes="(min-width: 768px) 32vw, 62vw"
                  className="object-cover"
                />
              </div>

              {/* Stat card — 210×95, near the top of the top image */}
              <div
                className="absolute left-[46%] top-[6%] z-20 flex h-[18.27%] w-[40.38%] flex-col justify-center rounded-[26px] px-5 text-white shadow-[0_24px_50px_-16px_rgba(15,23,42,0.45)]"
                style={{ background: "linear-gradient(135deg, #312938 0%, #1A1D20 100%)" }}
              >
                <p className="text-[clamp(22px,2.8vw,34px)] font-light leading-none tracking-tight">
                  <CountUp value="99.4%" />
                </p>
                <p className="mt-2 text-[10px] font-medium uppercase leading-snug tracking-label text-white/85">
                  Verified Peptide Purity
                </p>
              </div>
            </div>
          </div>

          {/* Right — copy */}
          <div data-reveal className="reveal-init">
            <span
              className="text-[12px] font-medium uppercase tracking-label"
              style={{ color: BRAND }}
            >
              Company About
            </span>
            <h2 className="mt-3 text-h2 font-normal text-balance text-ink">
              The fastest way to source peptides you can actually trust.
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-secondary">
              We started Peptiva Labs because the research peptide market needed a brand
              willing to be boring about the basics — transparent sourcing, real
              lab testing, and people you can actually message. Every batch is
              checked before it reaches our shelves.
            </p>

            <p className="mt-7 text-[15px] font-medium text-ink">
              Our Special Services:
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SERVICES.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Check />
                  <span className="text-[14px] text-ink-secondary">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <a
                href="#products"
                className="inline-flex items-center gap-2 rounded-pill px-6 py-3 text-[14px] font-medium text-white transition-all hover:-translate-y-0.5 hover:opacity-95"
                style={{ backgroundColor: BRAND }}
              >
                Browse Catalogue <ArrowRight />
              </a>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div
          data-reveal
          className="reveal-init mt-16 overflow-hidden rounded-card md:mt-24"
          style={{ backgroundColor: BRAND }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map(({ value, label, Icon }, i) => (
              <div
                key={label}
                className={`flex items-center gap-4 px-6 py-8 sm:px-8 sm:py-10 ${
                  i % 2 === 1 ? "" : "border-r border-white/10"
                } ${i < 2 ? "border-b border-white/10 md:border-b-0" : ""} ${
                  i === 1 ? "md:border-r" : ""
                } ${i === 2 ? "md:border-r" : ""}`}
              >
                <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-white/10 text-white">
                  <Icon />
                </span>
                <div>
                  <p className="text-[clamp(26px,3vw,38px)] font-light leading-none tracking-tight text-white">
                    <CountUp value={value} />
                  </p>
                  <p className="mt-1.5 text-[12px] leading-snug text-white/65">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
