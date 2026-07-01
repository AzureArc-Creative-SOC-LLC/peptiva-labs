"use client";

import { DotIcon } from "./icons";

const ITEMS = [
  "Verified Sourcing",
  "Lab-Tested Purity",
  "Sealed Cold Packaging",
  "WhatsApp Support",
];

export default function TrustedLogos() {
  // Repeat enough copies to fill the marquee with seamless loop
  const sequence = Array.from({ length: 4 }).flatMap(() => ITEMS);

  return (
    <section className="w-full">
      <div className="bg-slate-deep overflow-hidden py-6 sm:py-8">
        <div className="relative flex">
          <div className="flex shrink-0 animate-[marquee_36s_linear_infinite] items-center gap-8 sm:gap-12 pr-8 sm:pr-12">
            {sequence.map((label, i) => (
              <span
                key={`a-${i}`}
                className="inline-flex items-center gap-8 sm:gap-12 whitespace-nowrap text-white"
              >
                <span className="text-[clamp(28px,3.4vw,44px)] font-light tracking-tight">
                  {label}
                </span>
                <DotIcon className="text-white/70" />
              </span>
            ))}
          </div>
          <div
            aria-hidden
            className="flex shrink-0 animate-[marquee_36s_linear_infinite] items-center gap-8 sm:gap-12 pr-8 sm:pr-12"
          >
            {sequence.map((label, i) => (
              <span
                key={`b-${i}`}
                className="inline-flex items-center gap-8 sm:gap-12 whitespace-nowrap text-white"
              >
                <span className="text-[clamp(28px,3.4vw,44px)] font-light tracking-tight">
                  {label}
                </span>
                <DotIcon className="text-white/70" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </section>
  );
}
