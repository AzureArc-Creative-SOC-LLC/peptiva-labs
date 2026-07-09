"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "@/components/icons";
import {
  ApiError,
  getOrder,
  type OrderItemRow,
  type OrderRow,
  type PaymentRow,
} from "@/lib/api";
import { formatAED } from "@/lib/products";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function toNumber(v: number | string | null | undefined): number {
  const n = typeof v === "number" ? v : parseFloat(v || "0");
  return Number.isFinite(n) ? n : 0;
}

function statusStyles(status: string): string {
  const s = (status || "").toLowerCase();
  if (["completed", "paid", "received", "shipped", "delivered", "success"].includes(s)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (["rejected", "failed", "cancelled", "declined"].includes(s)) {
    return "border-red-200 bg-red-50 text-red-700";
  }
  return "border-line bg-white text-ink-secondary";
}

export default function OrderDetailPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const orderNumber = decodeURIComponent(params.orderNumber);
  const [data, setData] = useState<{
    order: OrderRow;
    items: OrderItemRow[];
    payments: PaymentRow[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrder(orderNumber)
      .then(setData)
      .catch((e) => {
        setError(
          e instanceof ApiError
            ? e.status === 404
              ? "Order not found"
              : e.message
            : "Failed to load order"
        );
      })
      .finally(() => setLoading(false));
  }, [orderNumber]);

  return (
    <>
      <Navbar />
      <main className="section-block bg-canvas pb-24 pt-28 sm:pt-32">
        <div className="container-fluid">
          <Link
            href="/track-order"
            className="inline-flex items-center gap-2 text-[13px] text-ink-secondary transition-colors hover:text-ink"
          >
            <ArrowLeft /> Back to orders
          </Link>

          {loading && (
            <p className="mt-8 text-[15px] text-ink-secondary">Loading order…</p>
          )}

          {error && (
            <div className="mt-8 max-w-xl rounded-card border border-line bg-white p-8">
              <p className="text-[15px] font-medium text-ink">
                Couldn&rsquo;t open this order
              </p>
              <p className="mt-2 text-[14px] text-ink-secondary">{error}</p>
              <Link href="/track-order" className="btn-dark mt-6">
                Look up your orders
              </Link>
            </div>
          )}

          {data && (
            <>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-label text-ink-muted">
                    Peptiva Labs · Order
                  </p>
                  <h1 className="mt-2 text-[clamp(36px,5vw,52px)] font-medium leading-[1] tracking-tight2 text-ink">
                    {data.order.order_number}
                  </h1>
                  <p className="mt-2 text-[13px] text-ink-muted">
                    Placed {formatDate(data.order.created_at)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center rounded-pill border px-3 py-1 text-[12px] font-medium uppercase tracking-label ${statusStyles(
                      data.order.status
                    )}`}
                  >
                    {data.order.status || "pending"}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-pill border px-3 py-1 text-[12px] font-medium uppercase tracking-label ${statusStyles(
                      data.order.payment_status
                    )}`}
                  >
                    Payment: {data.order.payment_status || "pending"}
                  </span>
                </div>
              </div>

              {data.order.tracking_number && (
                <div className="mt-6 flex flex-wrap items-center gap-3 rounded-card bg-surface-soft px-5 py-4">
                  <p className="text-[11px] uppercase tracking-label text-ink-muted">
                    Tracking
                  </p>
                  <p className="text-[14px] font-medium text-ink">
                    {data.order.tracking_number}
                  </p>
                </div>
              )}

              <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                {/* Items + payments */}
                <div className="lg:col-span-7">
                  <section className="rounded-card border border-line bg-white p-6 sm:p-8">
                    <p className="text-[11px] uppercase tracking-label text-ink-muted">
                      Items
                    </p>
                    <ul className="mt-5 divide-y divide-line border-y border-line">
                      {data.items.map((it) => (
                        <li
                          key={it.id}
                          className="flex items-center justify-between py-3"
                        >
                          <div className="min-w-0 pr-4">
                            <p className="truncate text-[14px] font-medium text-ink">
                              {it.name}
                            </p>
                            <p className="text-[12px] text-ink-muted">
                              Qty {it.quantity} ·{" "}
                              {formatAED(toNumber(it.unit_price))} each
                              {it.sku ? ` · ${it.sku}` : ""}
                            </p>
                          </div>
                          <span className="text-[14px] font-medium text-ink">
                            {formatAED(toNumber(it.line_total))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="mt-8 rounded-card border border-line bg-white p-6 sm:p-8">
                    <p className="text-[11px] uppercase tracking-label text-ink-muted">
                      Payments
                    </p>
                    {data.payments.length === 0 ? (
                      <p className="mt-4 text-[13px] text-ink-secondary">
                        No payments recorded yet.
                      </p>
                    ) : (
                      <ol className="mt-5 space-y-4">
                        {data.payments.map((p) => (
                          <li
                            key={p.id}
                            className="flex items-start justify-between gap-3 rounded-xl bg-surface-soft p-4"
                          >
                            <div>
                              <p className="text-[13px] font-medium text-ink">
                                {p.provider} · {p.provider_id}
                              </p>
                              <p className="mt-0.5 text-[12px] text-ink-muted">
                                {formatDateTime(p.created_at)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[13px] font-medium text-ink">
                                {formatAED(toNumber(p.amount))} {p.currency}
                              </p>
                              <span
                                className={`mt-1 inline-flex items-center rounded-pill border px-2 py-0.5 text-[10px] font-medium uppercase tracking-label ${statusStyles(
                                  p.status
                                )}`}
                              >
                                {p.status}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}
                  </section>
                </div>

                {/* Totals */}
                <aside className="lg:col-span-5">
                  <div className="rounded-card bg-surface-dim p-6 sm:p-8 lg:sticky lg:top-28">
                    <p className="text-[11px] uppercase tracking-label text-ink-muted">
                      Totals
                    </p>
                    <div className="mt-5 flex items-center justify-between text-[14px] text-ink-secondary">
                      <span>Subtotal</span>
                      <span className="font-medium text-ink">
                        {formatAED(toNumber(data.order.subtotal))}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[14px] text-ink-secondary">
                      <span>Shipping</span>
                      <span className="font-medium text-ink">
                        {formatAED(toNumber(data.order.shipping))}
                      </span>
                    </div>
                    {toNumber(data.order.discount_amount) > 0 && (
                      <div className="mt-3 flex items-center justify-between text-[14px] text-ink-secondary">
                        <span>Discount</span>
                        <span className="font-medium text-ink">
                          −{formatAED(toNumber(data.order.discount_amount))}
                        </span>
                      </div>
                    )}
                    <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
                      <span className="text-[16px] font-medium text-ink">
                        Total
                      </span>
                      <span className="text-[22px] font-medium text-ink">
                        {formatAED(toNumber(data.order.total))}
                      </span>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                      <Link href="/track-order" className="btn-dark w-full justify-center">
                        Look up another order
                      </Link>
                      <Link
                        href="/#products"
                        className="inline-flex w-full items-center justify-center rounded-pill border border-line bg-white px-5 py-2.5 text-[14px] font-medium text-ink transition-colors hover:bg-canvas"
                      >
                        Shop the Peptiva Labs range
                      </Link>
                    </div>
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
