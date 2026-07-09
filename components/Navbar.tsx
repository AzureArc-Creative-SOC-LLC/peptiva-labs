"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo, MenuIcon, CloseIcon, CartIcon } from "./icons";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Products", href: "/#products" },
  { label: "Why Us", href: "/#why" },
  { label: "Testimonial", href: "/#testimonial" },
  { label: "Contact", href: "/#contact" },
];

function CartButton({ onClick }: { onClick?: () => void }) {
  const { count, hydrated } = useCart();
  return (
    <Link
      href="/cart"
      onClick={onClick}
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition-colors hover:bg-canvas"
    >
      <CartIcon width={20} height={20} />
      {hydrated && count > 0 && (
        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink_btn px-1 text-[11px] font-medium text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

function AccountButton({ onClick }: { onClick?: () => void }) {
  const { user, hydrated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  if (!hydrated) {
    return <div className="h-10 w-10 sm:h-11 sm:w-11" aria-hidden />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        onClick={onClick}
        className="hidden text-[14px] text-ink-secondary transition-colors hover:text-ink sm:inline-flex"
      >
        Sign in
      </Link>
    );
  }

  const initial = (user.name || user.email || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Account menu"
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((v) => !v);
        }}
        className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-ink_btn text-[13px] font-medium text-white transition-opacity hover:opacity-90"
      >
        {initial}
      </button>
      {menuOpen && (
        <div
          role="menu"
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-[calc(100%+8px)] w-56 overflow-hidden rounded-card border border-line bg-white shadow-card"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="text-[13px] font-medium text-ink">{user.name}</p>
            <p className="mt-0.5 truncate text-[12px] text-ink-muted">
              {user.email}
            </p>
          </div>
          <Link
            href="/account"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2.5 text-[13px] text-ink hover:bg-canvas"
          >
            Account · Wallet · Affiliate
          </Link>
          <Link
            href="/track-order"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2.5 text-[13px] text-ink hover:bg-canvas"
          >
            Track order
          </Link>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              logout();
            }}
            className="block w-full border-t border-line px-4 py-2.5 text-left text-[13px] text-ink-secondary transition-colors hover:bg-canvas hover:text-ink"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", onKey);
      };
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Header stays visible at all times — only the drop-shadow gets stronger
  // once the user scrolls past the top so the pill separates cleanly from
  // whatever content is scrolling behind it.
  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 8);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 pt-4">
        <div className="container-fluid">
          <div
            className={`nav-pill flex h-[56px] sm:h-[60px] items-center justify-between pl-4 pr-1.5 sm:pl-5 sm:pr-2 transition-shadow duration-300 ${
              scrolled ? "shadow-card" : "shadow-soft"
            }`}
          >
            <Link href="/" aria-label="Peptiva Labs home">
              <Logo />
            </Link>

            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex xl:gap-8">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-[14px] text-ink-secondary hover:text-ink transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <AccountButton />
              <CartButton />
              <Link href="/#products" className="btn-dark hidden lg:inline-flex">
                Shop now
              </Link>

              <button
                className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-ink_btn text-white lg:hidden"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
              >
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay — rendered OUTSIDE the transformed header so `fixed`
          positions against the viewport and the solid background stays opaque. */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-canvas transition-opacity duration-200 lg:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="container-fluid flex h-[72px] flex-none items-center justify-between border-b border-line sm:h-[88px]">
          <Link
            href="/"
            aria-label="Peptiva Labs home"
            onClick={() => setOpen(false)}
          >
            <Logo />
          </Link>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink_btn text-white sm:h-11 sm:w-11"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="container-fluid flex flex-col pt-2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 text-xl font-medium text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="container-fluid mt-6">
            <p className="text-[11px] uppercase tracking-label text-ink-muted">
              Account
            </p>
            <div className="mt-2 flex flex-col">
              {user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="border-b border-line py-3.5 text-[16px] font-medium text-ink"
                  >
                    Account
                  </Link>
                  <Link
                    href="/track-order"
                    onClick={() => setOpen(false)}
                    className="border-b border-line py-3.5 text-[16px] font-medium text-ink"
                  >
                    Track order
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="border-b border-line py-3.5 text-[16px] font-medium text-ink"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="border-b border-line py-3.5 text-[16px] font-medium text-ink"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="container-fluid mt-auto flex flex-col gap-3 py-6">
            <Link
              href="/#products"
              onClick={() => setOpen(false)}
              className="btn-dark w-full justify-center"
            >
              Shop now
            </Link>
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-pill border border-line bg-white px-5 py-2.5 text-[14px] font-medium text-ink"
            >
              View cart
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
