"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a numeric value up from zero to its target the first time it scrolls
 * into view. Preserves any prefix/suffix and formatting in the source string
 * (e.g. "99.4%", "5,000+", "8+"). Shows the final value immediately under
 * prefers-reduced-motion.
 */
function parse(value: string) {
  const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
  if (!match) return { prefix: "", target: 0, suffix: value, decimals: 0 };
  const prefix = match[1];
  const raw = match[2];
  const suffix = match[3];
  const target = parseFloat(raw.replace(/,/g, ""));
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  return { prefix, target, suffix, decimals };
}

export default function CountUp({
  value,
  className,
  duration = 1600,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { prefix, target, suffix, decimals } = parse(value);
    const fmt = (n: number) =>
      prefix +
      n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) +
      suffix;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(fmt(target));
      return;
    }

    // Start collapsed; reveal-count on first intersection.
    setDisplay(fmt(0));
    let raf = 0;
    let started = false;

    const run = (start: number) => {
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
        setDisplay(fmt(target * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
        else setDisplay(fmt(target));
      };
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (started) return;
      started = true;
      run(performance.now());
    };

    // Handle elements that are already on-screen or already scrolled past.
    const rect = el.getBoundingClientRect();
    if (rect.bottom <= 0) {
      setDisplay(fmt(target));
      return;
    }
    if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
      start();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            start();
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`} suppressHydrationWarning>
      {display}
    </span>
  );
}
