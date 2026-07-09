"use client";

import Image from "next/image";
import { useReveal } from "./useReveal";
import {
  ShieldIcon,
  VialIcon,
  TruckIcon,
  ChatIcon,
  ArrowUpRight,
} from "./icons";

export default function Features() {
  const scope = useReveal<HTMLDivElement>();

  const tileBase =
    "reveal-init flex flex-col rounded-card p-6 sm:p-7 transition-all duration-300";

  return (
    <section id="why" className="section-block py-12 sm:py-16 md:py-24">
      <div ref={scope} className="container-fluid">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:auto-rows-[230px]">
          {/* Heading tile — col 3-4, row 1 */}
          <div
            data-reveal
            className={`${tileBase} justify-center border border-line bg-white sm:col-span-2 lg:col-start-3 lg:row-start-1 lg:items-end lg:text-right`}
          >
            <span className="inline-flex w-fit items-center gap-2 rounded-pill border border-line bg-canvas px-4 py-1.5 text-[11px] uppercase tracking-label text-ink-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Why Peptiva Labs
            </span>
            <h2 className="mt-4 text-[clamp(30px,3.4vw,46px)] font-medium uppercase leading-[1.02] tracking-tight2 text-ink">
              Why Choose
              <br />
              Peptiva Labs?
            </h2>
            <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-ink-secondary">
              Purity, paperwork, and real customer service — all on the same
              side of the table.
            </p>
          </div>

          {/* Center image — col 2, rows 1-2 */}
          <div
            data-img-reveal
            className="relative overflow-hidden rounded-card bg-surface-mute sm:col-span-2 sm:row-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:row-span-2"
          >
            <Image
              src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=900&auto=format&fit=crop&q=70"
              alt="Researcher at work in the Peptiva Labs Dubai facility"
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 100vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* A — dark tile, col 1 row 1 */}
          <div
            data-reveal
            className={`${tileBase} bg-ink_btn text-white lg:col-start-1 lg:row-start-1`}
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
              <VialIcon />
            </span>
            <h3 className="mt-auto pt-6 text-[16px] font-medium uppercase tracking-tight text-white">
              Lab-tested vials
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/65">
              Every batch is screened for purity. Out of spec means it never
              ships.
            </p>
          </div>

          {/* B — light tile + CTA, col 1 row 2 */}
          <div
            data-reveal
            className={`${tileBase} border border-line bg-white text-ink lg:col-start-1 lg:row-start-2`}
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-soft text-ink">
              <ShieldIcon />
            </span>
            <h3 className="mt-5 text-[16px] font-medium uppercase tracking-tight">
              Traceable sourcing
            </h3>
            <a
              href="#contact"
              className="mt-auto inline-flex items-center gap-2 pt-4 text-[14px] font-medium text-ink hover:opacity-70"
            >
              <ArrowUpRight /> Talk to the team
            </a>
          </div>

          {/* C — accent tile, col 3 row 2 */}
          <div
            data-reveal
            className={`${tileBase} bg-lilac text-ink lg:col-start-3 lg:row-start-2`}
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/50 text-ink">
              <TruckIcon />
            </span>
            <h3 className="mt-auto pt-6 text-[16px] font-medium uppercase tracking-tight">
              UAE stock, AED pricing
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-secondary">
              Cold-stored in Dubai and dispatched same or next working day.
            </p>
          </div>

          {/* D — dark tile + circular button, col 4 row 2 */}
          <div
            data-reveal
            className={`${tileBase} bg-ink_btn text-white lg:col-start-4 lg:row-start-2`}
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
              <ChatIcon />
            </span>
            <h3 className="mt-auto text-[16px] font-medium uppercase tracking-tight text-white">
              A human on WhatsApp
            </h3>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-[13px] leading-relaxed text-white/65">
                Real replies, fast.
              </p>
              <a
                href="#contact"
                aria-label="Message us on WhatsApp"
                className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-full bg-white text-ink transition-transform hover:-translate-y-0.5"
              >
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
