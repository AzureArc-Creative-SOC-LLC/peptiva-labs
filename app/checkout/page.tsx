"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";
import { ArrowLeft } from "@/components/icons";
import { getProduct, formatAED, type Product } from "@/lib/products";
import { ApiError, createCentralOrder, validatePromo } from "@/lib/api";

const SHIPPING_FEE = 45;

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  line1: string;
  line2: string;
  city: string;
  postcode: string;
  country: string;
};

const EMPTY_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  line1: "",
  line2: "",
  city: "",
  postcode: "",
  country: "",
};

export default function CheckoutPage() {
  const { items, hydrated, clear } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<{ code: string; percent: number } | null>(
    null
  );
  const [promoBusy, setPromoBusy] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [placed, setPlaced] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [placedTotal, setPlacedTotal] = useState(0);

  // Prefill from logged-in user (only once).
  const [prefilled, setPrefilled] = useState(false);
  if (user && !prefilled) {
    setPrefilled(true);
    setForm((f) => {
      const parts = (user.name || "").trim().split(/\s+/);
      return {
        ...f,
        firstName: f.firstName || parts.slice(0, -1).join(" ") || parts[0] || "",
        lastName:
          f.lastName || (parts.length > 1 ? parts[parts.length - 1] : ""),
        email: f.email || user.email || "",
        mobile: f.mobile || user.phone || "",
        country: f.country || user.country_of_residence || "",
      };
    });
  }

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const lines = items
    .map((i) => {
      const product = getProduct(i.slug);
      return product ? { ...i, product } : null;
    })
    .filter((l): l is { slug: string; qty: number; product: Product } =>
      l !== null
    );

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const shipping = lines.length > 0 ? SHIPPING_FEE : 0;
  const discount = promo ? Math.round(subtotal * promo.percent) / 100 : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  async function applyPromo() {
    const code = promoInput.trim();
    if (!code) return;
    setPromoBusy(true);
    setPromoError(null);
    try {
      const r = await validatePromo(code);
      setPromo({ code: code.toUpperCase(), percent: r.percent });
    } catch (e) {
      setPromo(null);
      setPromoError(
        e instanceof ApiError
          ? e.status === 404
            ? "Invalid promo code"
            : e.message
          : "Failed to validate promo"
      );
    } finally {
      setPromoBusy(false);
    }
  }

  function removePromo() {
    setPromo(null);
    setPromoInput("");
    setPromoError(null);
  }

  async function placeOrder() {
    setOrderError(null);
    setPlacing(true);
    try {
      const r = await createCentralOrder({
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          mobile: form.mobile,
        },
        shippingAddress: {
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          postcode: form.postcode,
          country: form.country,
        },
        promoCode: promo?.code,
        items: lines.map((l) => ({
          name: l.product.name,
          price: l.product.price,
          qty: l.qty,
          sku: l.product.slug,
        })),
        subtotal,
        shipping,
        discount,
        total,
      });
      setOrderRef(r.orderNumber);
      setPlacedTotal(r.totals?.total ?? total);
      setPlaced(true);
      clear();
    } catch (e) {
      setOrderError(
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Failed to place order"
      );
    } finally {
      setPlacing(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="section-block bg-canvas pb-20 pt-28 sm:pt-32">
        <div className="container-fluid">
          {!hydrated ? (
            <p className="mt-6 text-[15px] text-ink-secondary">Loading…</p>
          ) : lines.length === 0 && !placed ? (
            <div className="mx-auto flex max-w-xl flex-col items-center rounded-card border border-line bg-white p-12 text-center">
              <h1 className="text-[clamp(28px,3.4vw,40px)] font-medium tracking-tight2 text-ink">
                Your cart is empty
              </h1>
              <p className="mt-3 text-[15px] text-ink-secondary">
                Add a compound before proceeding to checkout.
              </p>
              <Link href="/#products" className="btn-dark mt-7">
                Browse the catalogue
              </Link>
            </div>
          ) : (
            <>
              {/* Heading row */}
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/cart"
                    className="inline-flex items-center gap-2 text-[13px] text-ink-secondary transition-colors hover:text-ink"
                  >
                    <ArrowLeft /> Back to cart
                  </Link>
                  <span className="text-[11px] uppercase tracking-label text-ink-muted">
                    Final step
                  </span>
                </div>
                <h1 className="mt-2 text-[clamp(44px,7vw,96px)] font-medium leading-[1] tracking-tight2 text-ink">
                  Checkout
                </h1>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
                {/* Form column */}
                <form
                  className="lg:col-span-7"
                  onSubmit={(e) => {
                    e.preventDefault();
                    placeOrder();
                  }}
                >
                  {/* Contact */}
                  <section>
                    <p className="text-[11px] uppercase tracking-label text-ink-muted">
                      Contact
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field
                        label="First name"
                        placeholder="Jordan"
                        value={form.firstName}
                        onChange={(v) => update("firstName", v)}
                      />
                      <Field
                        label="Last name"
                        placeholder="Avery"
                        value={form.lastName}
                        onChange={(v) => update("lastName", v)}
                      />
                      <Field
                        label="Email address"
                        type="email"
                        placeholder="jordan@lab.com"
                        full
                        value={form.email}
                        onChange={(v) => update("email", v)}
                      />
                      <Field
                        label="Mobile"
                        type="tel"
                        placeholder="+971 54 …"
                        full
                        value={form.mobile}
                        onChange={(v) => update("mobile", v)}
                      />
                    </div>
                  </section>

                  {/* Shipping */}
                  <section className="mt-10">
                    <p className="text-[11px] uppercase tracking-label text-ink-muted">
                      Shipping address
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field
                        label="Address line 1"
                        placeholder="123 Research Park"
                        full
                        value={form.line1}
                        onChange={(v) => update("line1", v)}
                      />
                      <Field
                        label={
                          <>
                            Address line 2{" "}
                            <span className="text-ink-muted">(optional)</span>
                          </>
                        }
                        required={false}
                        placeholder="Unit 4B"
                        full
                        value={form.line2}
                        onChange={(v) => update("line2", v)}
                      />
                      <Field
                        label="City"
                        placeholder="Dubai"
                        value={form.city}
                        onChange={(v) => update("city", v)}
                      />
                      <Field
                        label="Postcode"
                        placeholder="00000"
                        value={form.postcode}
                        onChange={(v) => update("postcode", v)}
                      />
                      <Field
                        label="Country"
                        placeholder="United Arab Emirates"
                        full
                        value={form.country}
                        onChange={(v) => update("country", v)}
                      />
                    </div>
                  </section>

                  {orderError && (
                    <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">
                      {orderError}
                    </p>
                  )}

                  {/* Mobile-only place order button */}
                  <button
                    type="submit"
                    disabled={placing}
                    className="btn-dark mt-8 w-full justify-center disabled:opacity-60 lg:hidden"
                  >
                    {placing ? "Placing order…" : `Place order · ${formatAED(total)}`}
                  </button>
                </form>

                {/* Order summary */}
                <aside className="lg:col-span-5">
                  <div className="rounded-card bg-surface-soft p-6 sm:p-8 lg:sticky lg:top-28">
                    <p className="text-[11px] uppercase tracking-label text-ink-muted">
                      Order summary
                    </p>

                    <ul className="mt-6 space-y-4">
                      {lines.map((l) => (
                        <li key={l.slug} className="flex items-center gap-3">
                          <div className="relative flex-none">
                            <div className="relative h-14 w-14 overflow-hidden rounded-image bg-surface-mute">
                              <Image
                                src={l.product.img}
                                alt={l.product.name}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            </div>
                            <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink_btn px-1 text-[11px] font-medium text-white ring-2 ring-surface-soft">
                              {l.qty}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[14px] font-medium text-ink">
                              {l.product.name}
                            </p>
                            <p className="text-[12px] text-ink-muted">
                              {l.product.meta}
                            </p>
                          </div>
                          <span className="text-[14px] font-medium text-ink">
                            {formatAED(l.product.price * l.qty)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Promo code */}
                    <div className="mt-6 border-t border-line pt-6">
                      {promo ? (
                        <div className="flex items-center justify-between rounded-pill bg-white px-4 py-2.5">
                          <div>
                            <p className="text-[13px] font-medium text-ink">
                              {promo.code} · −{promo.percent}%
                            </p>
                            <p className="text-[11px] text-ink-muted">
                              Applied to subtotal
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={removePromo}
                            className="text-[12px] text-ink-secondary underline-offset-4 hover:text-ink hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Promo code"
                              value={promoInput}
                              onChange={(e) => setPromoInput(e.target.value)}
                              className="min-w-0 flex-1 rounded-pill border border-line bg-white px-4 py-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-subtle focus:border-ink/30"
                            />
                            <button
                              type="button"
                              onClick={applyPromo}
                              disabled={promoBusy || !promoInput.trim()}
                              className="rounded-pill border border-line bg-white px-4 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-canvas disabled:opacity-50"
                            >
                              {promoBusy ? "…" : "Apply"}
                            </button>
                          </div>
                          {promoError && (
                            <p className="mt-2 text-[12px] text-red-600">
                              {promoError}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-between text-[14px] text-ink-secondary">
                      <span>Subtotal</span>
                      <span className="font-medium text-ink">
                        {formatAED(subtotal)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[14px] text-ink-secondary">
                      <span>Shipping</span>
                      <span className="font-medium text-ink">
                        {formatAED(shipping)}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="mt-3 flex items-center justify-between text-[14px] text-ink-secondary">
                        <span>Discount ({promo?.code})</span>
                        <span className="font-medium text-ink">
                          −{formatAED(discount)}
                        </span>
                      </div>
                    )}
                    <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
                      <span className="text-[16px] font-medium text-ink">
                        Total
                      </span>
                      <span className="text-[22px] font-medium text-ink">
                        {formatAED(total)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={placeOrder}
                      disabled={placing}
                      className="btn-dark mt-6 hidden w-full justify-center disabled:opacity-60 lg:inline-flex"
                    >
                      {placing
                        ? "Placing order…"
                        : `Place order · ${formatAED(total)}`}
                    </button>

                    <p className="mt-4 text-center text-[12px] leading-relaxed text-ink-muted">
                      Payment by bank transfer. We&rsquo;ll email you secure
                      payment instructions and a capture link for your receipt.
                    </p>
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />

      {placed && <OrderPlacedModal orderRef={orderRef} total={placedTotal} />}
    </>
  );
}

function OrderPlacedModal({
  orderRef,
  total,
}: {
  orderRef: string;
  total: number;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Order placed"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-5 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-card bg-surface-soft p-8 text-center shadow-card">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-ink">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5l4 4 10-10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h2 className="mt-5 text-[26px] font-medium tracking-tight2 text-ink">
          Order placed
        </h2>
        <p className="mx-auto mt-3 max-w-xs text-[14px] leading-relaxed text-ink-secondary">
          Thank you. Check your inbox — we&rsquo;ve sent payment instructions
          and a secure link to upload your bank-transfer screenshot.
        </p>

        <div className="mt-6 flex items-center justify-between rounded-xl bg-white px-4 py-3 text-left">
          <div>
            <p className="text-[10px] uppercase tracking-label text-ink-muted">
              Order reference
            </p>
            <p className="mt-0.5 text-[13px] font-medium text-ink">
              {orderRef}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-label text-ink-muted">
              Total
            </p>
            <p className="mt-0.5 text-[14px] font-medium text-ink">
              {formatAED(total)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/track-order"
            className="btn-dark justify-center sm:min-w-[160px]"
          >
            Track order
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-pill border border-line bg-white px-5 py-2.5 text-[14px] font-medium text-ink transition-colors hover:bg-canvas sm:min-w-[160px]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  label: React.ReactNode;
  placeholder?: string;
  type?: string;
  full?: boolean;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
};

function Field({
  label,
  placeholder,
  type = "text",
  full = false,
  required = true,
  value,
  onChange,
}: FieldProps) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-[12px] font-medium text-ink">{label}</span>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-line bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-subtle focus:border-ink/30"
      />
    </label>
  );
}
