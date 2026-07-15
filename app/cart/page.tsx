"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartContext";
import { PlusIcon, MinusIcon, ArrowLeft } from "@/components/icons";
import { getProduct, formatUSD, type Product } from "@/lib/products";

const SHIPPING_FEE = 45;

export default function CartPage() {
  const { items, hydrated, setQty, remove, clear } = useCart();

  const lines = items
    .map((i) => {
      const product = getProduct(i.slug);
      return product ? { ...i, product } : null;
    })
    .filter((l): l is { slug: string; qty: number; product: Product } =>
      l !== null
    );

  const subtotal = lines.reduce(
    (sum, l) => sum + l.product.price * l.qty,
    0
  );
  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);
  const total = subtotal + (lines.length > 0 ? SHIPPING_FEE : 0);

  return (
    <>
      <Navbar />
      <main className="section-block bg-canvas pb-20 pt-28 sm:pt-32">
        <div className="container-fluid">
          {!hydrated ? (
            <p className="mt-6 text-[15px] text-ink-secondary">Loading…</p>
          ) : lines.length === 0 ? (
            <div className="mx-auto flex max-w-xl flex-col items-center rounded-card border border-line bg-white p-12 text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-surface-mute text-ink">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 6h16l-1.6 11.2A2 2 0 0 1 16.4 19H7.6a2 2 0 0 1-2-1.8L4 6Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 9V6a3 3 0 1 1 6 0v3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <h1 className="mt-5 text-[clamp(28px,3.4vw,40px)] font-medium tracking-tight2 text-ink">
                Your cart is empty
              </h1>
              <p className="mt-3 max-w-md text-[15px] text-ink-secondary">
                Explore our catalogue of research-grade peptides, each shipped
                with full documentation.
              </p>
              <Link href="/#products" className="btn-dark mt-7">
                Browse the catalogue
              </Link>
            </div>
          ) : (
            <>
              {/* Heading row */}
              <div>
                <p className="text-[11px] uppercase tracking-label text-ink-muted">
                  Your selection
                </p>
                <h1 className="mt-2 text-[clamp(44px,7vw,96px)] font-medium leading-[1] tracking-tight2 text-ink">
                  Cart
                </h1>
              </div>

              {/* Two columns */}
              <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
                {/* Line items */}
                <div className="lg:col-span-7">
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={clear}
                      className="text-[13px] text-ink-secondary transition-colors hover:text-ink"
                    >
                      Clear cart
                    </button>
                  </div>

                  <ul className="mt-3 divide-y divide-line border-y border-line">
                    {lines.map((l) => (
                      <li
                        key={l.slug}
                        className="grid grid-cols-[80px_1fr_auto] items-center gap-4 py-6 sm:grid-cols-[96px_1fr_auto] sm:gap-6"
                      >
                        <Link
                          href={`/products/${l.slug}`}
                          className="relative h-20 w-20 overflow-hidden rounded-image bg-surface-mute sm:h-24 sm:w-24"
                        >
                          <Image
                            src={l.product.img}
                            alt={l.product.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </Link>

                        <div className="min-w-0">
                          <p className="text-[11px] uppercase tracking-label text-ink-muted">
                            {l.product.category}
                          </p>
                          <Link
                            href={`/products/${l.slug}`}
                            className="mt-1 block text-[18px] font-medium text-ink hover:opacity-70 sm:text-[20px]"
                          >
                            {l.product.name}
                          </Link>

                          <div className="mt-4 flex flex-wrap items-center gap-4">
                            <div className="inline-flex items-center rounded-pill border border-line bg-white">
                              <button
                                aria-label="Decrease quantity"
                                onClick={() => setQty(l.slug, l.qty - 1)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-canvas"
                              >
                                <MinusIcon width={14} height={14} />
                              </button>
                              <span className="w-8 text-center text-[14px] font-medium">
                                {l.qty}
                              </span>
                              <button
                                aria-label="Increase quantity"
                                onClick={() => setQty(l.slug, l.qty + 1)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-canvas"
                              >
                                <PlusIcon width={14} height={14} />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(l.slug)}
                              className="text-[13px] text-ink-secondary underline-offset-4 transition-colors hover:text-ink hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="self-start text-right text-[16px] font-medium text-ink sm:text-[18px]">
                          {formatUSD(l.product.price * l.qty)}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/#products"
                    className="mt-6 inline-flex items-center gap-2 text-[14px] text-ink-secondary transition-colors hover:text-ink"
                  >
                    <ArrowLeft /> Continue shopping
                  </Link>
                </div>

                {/* Summary */}
                <aside className="lg:col-span-5">
                  <div className="rounded-card bg-surface-dimmer p-6 sm:p-8 lg:sticky lg:top-28">
                    <p className="text-[11px] uppercase tracking-label text-ink-muted">
                      Order summary
                    </p>
                    <div className="mt-6 flex items-center justify-between text-[14px] text-ink-secondary">
                      <span>
                        Subtotal ({itemCount} item
                        {itemCount === 1 ? "" : "s"})
                      </span>
                      <span className="font-medium text-ink">
                        {formatUSD(subtotal)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[14px] text-ink-secondary">
                      <span>Shipping — cold-chain dispatch</span>
                      <span className="font-medium text-ink">
                        {formatUSD(SHIPPING_FEE)}
                      </span>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                      <span className="text-[16px] font-medium text-ink">
                        Total
                      </span>
                      <div className="text-right">
                        <span className="text-[22px] font-medium text-ink">
                          {formatUSD(total)}
                        </span>
                        <p className="mt-0.5 text-[10px] uppercase tracking-label text-ink-muted">
                          USD · Tax included
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/checkout"
                      className="btn-dark mt-6 w-full justify-center"
                    >
                      Proceed to checkout
                    </Link>
                    <p className="mt-4 flex items-center justify-center gap-2 text-[12px] text-ink-muted">
                      <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                        <rect
                          x="1"
                          y="6"
                          width="10"
                          height="7"
                          rx="1.5"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M3 6V4a3 3 0 1 1 6 0v2"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                      </svg>
                      Secure, encrypted checkout
                    </p>
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
