"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthContext";
import { ApiError, getOrdersByEmail, type OrderRow } from "@/lib/api";
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

function toNumber(v: number | string | null | undefined): number {
  const n = typeof v === "number" ? v : parseFloat(v || "0");
  return Number.isFinite(n) ? n : 0;
}

function statusStyles(status: string): string {
  const s = (status || "").toLowerCase();
  if (["completed", "paid", "received", "shipped", "delivered"].includes(s)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (["rejected", "failed", "cancelled"].includes(s)) {
    return "border-red-200 bg-red-50 text-red-700";
  }
  return "border-line bg-white text-ink-secondary";
}

export default function TrackOrderPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefilled, setPrefilled] = useState(false);

  // Auto-fill and auto-search when a user is signed in.
  useEffect(() => {
    if (user?.email && !prefilled) {
      setEmail(user.email);
      setPrefilled(true);
      void lookup(user.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, prefilled]);

  async function lookup(overrideEmail?: string) {
    const target = (overrideEmail ?? email).trim();
    if (!target) return;
    setLoading(true);
    setError(null);
    try {
      const r = await getOrdersByEmail(target);
      setOrders(r.orders || []);
    } catch (e) {
      setOrders(null);
      setError(
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="section-block bg-canvas pb-24 pt-28 sm:pt-32">
        <div className="container-fluid">
          <p className="text-[11px] uppercase tracking-label text-ink-muted">
            Order lookup
          </p>
          <h1 className="mt-2 text-[clamp(44px,7vw,96px)] font-medium leading-[1] tracking-tight2 text-ink">
            Track order
          </h1>
          <p className="mt-4 max-w-xl text-[14px] text-ink-secondary">
            Enter the email you used at checkout to see the latest status,
            tracking and totals for each order.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void lookup();
            }}
            className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="you@lab.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-line bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-subtle focus:border-ink/30"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-dark justify-center disabled:opacity-60"
            >
              {loading ? "Looking up…" : "Look up orders"}
            </button>
          </form>

          {error && (
            <p className="mt-6 max-w-xl rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">
              {error}
            </p>
          )}

          {orders !== null && (
            <div className="mt-10">
              {orders.length === 0 ? (
                <div className="rounded-card border border-line bg-white p-8 text-center">
                  <p className="text-[15px] text-ink-secondary">
                    No orders found for that email.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-line border-y border-line">
                  {orders.map((o) => (
                    <li key={o.id}>
                      <Link
                        href={`/orders/${encodeURIComponent(o.order_number)}`}
                        className="grid grid-cols-1 gap-3 py-5 transition-colors hover:bg-white/50 sm:grid-cols-[1fr_auto] sm:items-center"
                      >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[15px] font-medium text-ink">
                            {o.order_number}
                          </p>
                          <span
                            className={`inline-flex items-center rounded-pill border px-2 py-0.5 text-[11px] font-medium uppercase tracking-label ${statusStyles(
                              o.status
                            )}`}
                          >
                            {o.status || "pending"}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-pill border px-2 py-0.5 text-[11px] font-medium uppercase tracking-label ${statusStyles(
                              o.payment_status
                            )}`}
                          >
                            Payment: {o.payment_status || "pending"}
                          </span>
                        </div>
                        <p className="mt-1 text-[12px] text-ink-muted">
                          Placed {formatDate(o.created_at)}
                          {o.tracking_number
                            ? ` · Tracking: ${o.tracking_number}`
                            : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[16px] font-medium text-ink">
                          {formatAED(toNumber(o.total))}
                        </p>
                        <p className="text-[11px] uppercase tracking-label text-ink-muted">
                          {o.payment_method || "Manual"}
                        </p>
                      </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {orders === null && !error && !loading && (
            <p className="mt-8 text-[13px] text-ink-secondary">
              Or{" "}
              <Link
                href="/login"
                className="text-ink underline underline-offset-2 hover:opacity-70"
              >
                sign in
              </Link>{" "}
              to auto-load your orders.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
