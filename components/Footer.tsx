"use client";

import { useState } from "react";
import Link from "next/link";
import { ApiError, newsletterSubscribe } from "@/lib/api";

type FooterLink = { label: string; href: string; external?: boolean };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Catalogue",
    links: [
      { label: "BPC-157 + TB-500", href: "/products/bpc-157-tb-500" },
      { label: "Glow", href: "/products/glow" },
      { label: "Retatrutide", href: "/products/retatrutide" },
      { label: "Tirzepatide", href: "/products/tirzepatide" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Lunvera", href: "/#about" },
      { label: "How we source", href: "/#why" },
      { label: "Reviews", href: "/#testimonial" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Track order", href: "/track-order" },
      { label: "Cart", href: "/cart" },
      { label: "Account", href: "/account" },
      { label: "Sign in", href: "/login" },
    ],
  },
  {
    title: "Connect",
    links: [
      {
        label: "WhatsApp",
        href: "https://wa.me/971543800625",
        external: true,
      },
      {
        label: "Email",
        href: "mailto:sales@lunvera.com",
        external: true,
      },
      { label: "Shop now", href: "/#products" },
      { label: "Register", href: "/register" },
    ],
  },
];

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(true);
  const [website, setWebsite] = useState(""); // honeypot
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<
    { ok: true; already?: boolean } | { ok: false; error: string } | null
  >(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setResult(null);
    try {
      const r = await newsletterSubscribe({
        email,
        consent,
        source: "footer",
        website,
      });
      setResult({ ok: true, already: !!r.already_subscribed });
      setEmail("");
    } catch (e) {
      setResult({
        ok: false,
        error:
          e instanceof ApiError
            ? e.message
            : e instanceof Error
              ? e.message
              : "Failed to subscribe",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6">
      <p className="text-[12px] font-medium text-white">
        Newsletter
      </p>
      <p className="mt-1 text-[12px] text-white/60">
        Batch drops, storage tips, sourcing notes. No spam.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          type="email"
          required
          placeholder="you@lab.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 rounded-pill border border-white/20 bg-white/10 px-4 py-2.5 text-[13px] text-white placeholder:text-white/50 outline-none focus:border-white/40"
        />
        <button
          type="submit"
          disabled={busy || !email}
          className="rounded-pill bg-white px-4 py-2.5 text-[13px] font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "…" : "Subscribe"}
        </button>
      </div>
      <label className="mt-3 flex items-center gap-2 text-[11px] text-white/60">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="h-3.5 w-3.5"
        />
        I agree to receive research updates.
      </label>
      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden
      />
      {result && result.ok && (
        <p className="mt-2 text-[12px] text-emerald-300">
          {result.already
            ? "You're already subscribed — thanks."
            : "Subscribed. Watch your inbox."}
        </p>
      )}
      {result && !result.ok && (
        <p className="mt-2 text-[12px] text-red-300">{result.error}</p>
      )}
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="bg-slate-deep px-5 pt-12 text-white sm:px-8 sm:pt-16 md:px-14 md:pt-20">
        <div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-12">
          {/* brand */}
          <div className="md:col-span-4">
            <span className="inline-flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-white/10">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M5.5 15.5 12 6.5l6.5 9"
                    stroke="#fff"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="5.5" cy="15.5" r="2.1" fill="#fff" />
                  <circle cx="12" cy="6.5" r="2.1" fill="#fff" />
                  <circle cx="18.5" cy="15.5" r="2.1" fill="#fff" />
                </svg>
              </span>
              <span className="font-display text-[21px] font-medium tracking-tight2">
                Lunvera
              </span>
            </span>
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-white/70">
              Research peptides sourced, verified and dispatched from Dubai.
              Honest sourcing, sealed handling, and a real person at the other
              end of every WhatsApp message.
            </p>
            <div className="mt-6 space-y-1 text-[13px] text-white/70">
              <p>Level 5, Business Bay, Dubai, UAE</p>
              <p>
                <a
                  href="https://wa.me/971543800625"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  +971 54 380 0625
                </a>
              </p>
              <p>
                <a
                  href="mailto:sales@lunvera.com"
                  className="hover:text-white"
                >
                  sales@lunvera.com
                </a>
              </p>
            </div>

            <NewsletterForm />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:col-span-8 md:grid-cols-4 md:gap-6">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="text-[14px] font-medium text-white">
                  {col.title}
                </h4>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.external ? (
                        <a
                          href={l.href}
                          target={
                            l.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            l.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="text-[14px] text-white/60 transition-colors hover:text-white"
                        >
                          {l.label}
                        </a>
                      ) : (
                        <Link
                          href={l.href}
                          className="text-[14px] text-white/60 transition-colors hover:text-white"
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Massive wordmark */}
        <div className="relative mt-12 select-none overflow-hidden">
          <div className="flex justify-center leading-none">
            <span
              className="font-light text-white"
              style={{
                fontSize: "clamp(140px, 26vw, 360px)",
                letterSpacing: "-0.06em",
                lineHeight: 0.85,
              }}
            >
              Lunvera
            </span>
          </div>
        </div>

        <div className="mt-2 flex flex-col items-center justify-between gap-3 border-t border-white/15 pb-8 pt-6 text-[12px] text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Lunvera. All rights reserved. For research use only.</p>
          <div className="flex items-center gap-6">
            <Link href="/#contact" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/#contact" className="transition-colors hover:text-white">
              Terms
            </Link>
            <Link href="/#contact" className="transition-colors hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
