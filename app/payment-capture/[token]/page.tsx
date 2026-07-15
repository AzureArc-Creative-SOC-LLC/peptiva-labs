"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ApiError,
  applyCapturePromo,
  uploadCaptureScreenshot,
  validateCaptureToken,
  type BankDetails,
  type OrderItemRow,
  type OrderRow,
  type PaymentRow,
} from "@/lib/api";
import { formatUSD } from "@/lib/products";

function toNumber(v: number | string | null | undefined): number {
  const n = typeof v === "number" ? v : parseFloat(v || "0");
  return Number.isFinite(n) ? n : 0;
}

type Ctx = {
  order: OrderRow;
  items: OrderItemRow[];
  payments: PaymentRow[];
  allowPromo: boolean;
  bank: BankDetails;
};

export default function PaymentCapturePage({
  params,
}: {
  params: { token: string };
}) {
  const token = decodeURIComponent(params.token);

  const [ctx, setCtx] = useState<Ctx | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [promoInput, setPromoInput] = useState("");
  const [promoBusy, setPromoBusy] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoApplied, setPromoApplied] = useState<{
    code: string;
    percent: number;
    total: number;
  } | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    status: "received" | "rejected" | "pending";
    screenshotUrl?: string;
    verification_error?: string;
  } | null>(null);

  useEffect(() => {
    validateCaptureToken(token)
      .then((r) => {
        setCtx({
          order: r.order,
          items: r.items,
          payments: r.payments,
          allowPromo: r.allowPromo,
          bank: r.bank,
        });
      })
      .catch((e) => {
        setError(
          e instanceof ApiError
            ? e.status === 404 || e.status === 400
              ? "This payment link is invalid or has expired."
              : e.message
            : "Failed to load payment link"
        );
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function handleApplyPromo() {
    const code = promoInput.trim();
    if (!code) return;
    setPromoBusy(true);
    setPromoError(null);
    try {
      const r = await applyCapturePromo(token, code);
      setPromoApplied({
        code: r.promoCode,
        percent: r.promoDiscountPercent,
        total: r.total,
      });
    } catch (e) {
      setPromoError(
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Failed to apply promo"
      );
    } finally {
      setPromoBusy(false);
    }
  }

  async function handleUpload() {
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const r = await uploadCaptureScreenshot(token, file);
      setResult({
        status: r.payment_status,
        screenshotUrl: r.screenshotUrl,
        verification_error: r.verification_error,
      });
    } catch (e) {
      setUploadError(
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="section-block bg-canvas pb-24 pt-28 sm:pt-32">
        <div className="container-fluid">
          <p className="text-[11px] uppercase tracking-label text-ink-muted">
            Payment upload
          </p>
          <h1 className="mt-2 text-[clamp(38px,6vw,72px)] font-medium leading-[1] tracking-tight2 text-ink">
            Complete your payment
          </h1>

          {loading && (
            <p className="mt-10 text-[15px] text-ink-secondary">
              Validating link…
            </p>
          )}

          {error && (
            <div className="mt-10 max-w-xl rounded-card border border-line bg-white p-8">
              <p className="text-[15px] font-medium text-ink">Link invalid</p>
              <p className="mt-2 text-[14px] text-ink-secondary">{error}</p>
              <Link href="/" className="btn-dark mt-6">
                Back to home
              </Link>
            </div>
          )}

          {ctx && !result && (
            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
              {/* Left: order + bank + upload */}
              <div className="lg:col-span-7">
                {/* Order summary */}
                <section className="rounded-card border border-line bg-white p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-label text-ink-muted">
                        Order
                      </p>
                      <p className="mt-1 text-[18px] font-medium text-ink">
                        {ctx.order.order_number}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-pill border border-line bg-canvas px-3 py-1 text-[11px] uppercase tracking-label text-ink-secondary">
                      Payment: {ctx.order.payment_status || "pending"}
                    </span>
                  </div>

                  <ul className="mt-6 divide-y divide-line border-y border-line">
                    {ctx.items.map((it) => (
                      <li key={it.id} className="flex items-center justify-between py-3">
                        <div className="min-w-0 pr-4">
                          <p className="truncate text-[14px] font-medium text-ink">
                            {it.name}
                          </p>
                          <p className="text-[12px] text-ink-muted">
                            Qty {it.quantity} · {formatUSD(toNumber(it.unit_price))} each
                          </p>
                        </div>
                        <span className="text-[14px] font-medium text-ink">
                          {formatUSD(toNumber(it.line_total))}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex items-center justify-between text-[14px] text-ink-secondary">
                    <span>Subtotal</span>
                    <span className="font-medium text-ink">
                      {formatUSD(toNumber(ctx.order.subtotal))}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[14px] text-ink-secondary">
                    <span>Shipping</span>
                    <span className="font-medium text-ink">
                      {formatUSD(toNumber(ctx.order.shipping))}
                    </span>
                  </div>
                  {(promoApplied || toNumber(ctx.order.discount_amount) > 0) && (
                    <div className="mt-2 flex items-center justify-between text-[14px] text-ink-secondary">
                      <span>Discount{promoApplied ? ` (${promoApplied.code})` : ""}</span>
                      <span className="font-medium text-ink">
                        −{formatUSD(toNumber(ctx.order.discount_amount))}
                      </span>
                    </div>
                  )}
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                    <span className="text-[16px] font-medium text-ink">
                      Total due
                    </span>
                    <span className="text-[22px] font-medium text-ink">
                      {formatUSD(promoApplied?.total ?? toNumber(ctx.order.total))}
                    </span>
                  </div>

                  {/* Promo (only if allowed) */}
                  {ctx.allowPromo && !promoApplied && (
                    <div className="mt-6 border-t border-line pt-5">
                      <p className="text-[12px] font-medium text-ink">
                        Have a promo code?
                      </p>
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          placeholder="Promo code"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="min-w-0 flex-1 rounded-pill border border-line bg-white px-4 py-2.5 text-[13px] text-ink outline-none focus:border-ink/30"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          disabled={promoBusy || !promoInput.trim()}
                          className="rounded-pill border border-line bg-white px-4 py-2.5 text-[13px] font-medium text-ink hover:bg-canvas disabled:opacity-50"
                        >
                          {promoBusy ? "…" : "Apply"}
                        </button>
                      </div>
                      {promoError && (
                        <p className="mt-2 text-[12px] text-red-600">{promoError}</p>
                      )}
                    </div>
                  )}
                  {promoApplied && (
                    <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[13px] text-emerald-800">
                      {promoApplied.code} · {promoApplied.percent}% off applied. New
                      total {formatUSD(promoApplied.total)}.
                    </p>
                  )}
                </section>

                {/* Upload */}
                <section className="mt-8 rounded-card border border-line bg-white p-6 sm:p-8">
                  <p className="text-[11px] uppercase tracking-label text-ink-muted">
                    Upload proof of payment
                  </p>
                  <h2 className="mt-2 text-[20px] font-medium tracking-tight2 text-ink">
                    Attach your bank-transfer screenshot
                  </h2>
                  <p className="mt-2 text-[13px] text-ink-secondary">
                    We&rsquo;ll verify it and mark your order as paid. Accepted
                    formats: any image. Max 25 MB.
                  </p>

                  <label
                    htmlFor="screenshot"
                    className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-card border border-dashed border-line bg-canvas p-8 text-center transition-colors hover:border-ink/40"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 15V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-3 text-[14px] font-medium text-ink">
                      {file ? file.name : "Choose image or drag it here"}
                    </p>
                    <p className="mt-1 text-[12px] text-ink-muted">
                      {file ? `${(file.size / 1024).toFixed(0)} KB` : "PNG, JPG up to 25 MB"}
                    </p>
                    <input
                      ref={fileRef}
                      id="screenshot"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                  </label>

                  {uploadError && (
                    <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">
                      {uploadError}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="btn-dark mt-5 w-full justify-center disabled:opacity-60"
                  >
                    {uploading ? "Uploading…" : "Submit for verification"}
                  </button>
                </section>
              </div>

              {/* Right: bank details */}
              <aside className="lg:col-span-5">
                <div className="rounded-card bg-surface-dim p-6 sm:p-8 lg:sticky lg:top-28">
                  <p className="text-[11px] uppercase tracking-label text-ink-muted">
                    Transfer to
                  </p>
                  <div className="mt-4 grid gap-3 text-[14px]">
                    <BankRow label="Payee" value={ctx.bank.payeeName} />
                    <BankRow label="Sort code" value={ctx.bank.sortCode} mono />
                    <BankRow
                      label="Account number"
                      value={ctx.bank.accountNumber}
                      mono
                    />
                    <BankRow label="Reference" value={ctx.bank.reference} mono />
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                    <span className="text-[14px] text-ink-secondary">
                      Amount to send
                    </span>
                    <span className="text-[20px] font-medium text-ink">
                      {formatUSD(promoApplied?.total ?? toNumber(ctx.order.total))}
                    </span>
                  </div>
                  <p className="mt-4 text-[12px] leading-relaxed text-ink-muted">
                    Use the reference above so we can match your transfer. After
                    sending, upload the confirmation screenshot on the left.
                  </p>
                </div>
              </aside>
            </div>
          )}

          {result && (
            <ResultCard
              status={result.status}
              screenshotUrl={result.screenshotUrl}
              verification_error={result.verification_error}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function BankRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-ink-secondary">{label}</span>
      <div className="flex items-center gap-2">
        <span
          className={`font-medium text-ink ${mono ? "font-mono" : ""}`}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={copy}
          className="rounded-md px-2 py-1 text-[11px] font-medium text-ink-secondary transition-colors hover:bg-white hover:text-ink"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function ResultCard({
  status,
  screenshotUrl,
  verification_error,
}: {
  status: "received" | "rejected" | "pending";
  screenshotUrl?: string;
  verification_error?: string;
}) {
  const config = {
    received: {
      title: "Payment received",
      body: "Your transfer was verified. We&rsquo;ll dispatch your order shortly.",
      color: "bg-emerald-50 border-emerald-200 text-emerald-800",
    },
    rejected: {
      title: "Payment couldn't be verified",
      body: "The screenshot didn&rsquo;t match the expected transfer. Please double-check the amount and reference, then try again.",
      color: "bg-red-50 border-red-200 text-red-700",
    },
    pending: {
      title: "Awaiting manual review",
      body: "Automatic verification isn&rsquo;t available right now. Our team will review your screenshot shortly.",
      color: "bg-surface-soft border-line text-ink-secondary",
    },
  }[status];
  return (
    <div className="mt-10 max-w-xl">
      <div className={`rounded-card border p-6 sm:p-8 ${config.color}`}>
        <p className="text-[11px] uppercase tracking-label opacity-70">
          Verification result
        </p>
        <h2 className="mt-2 text-[22px] font-medium tracking-tight2 text-ink">
          {config.title}
        </h2>
        <p
          className="mt-3 text-[14px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: config.body }}
        />
        {verification_error && (
          <p className="mt-3 text-[12px] opacity-80">
            Details: {verification_error}
          </p>
        )}
        {screenshotUrl && (
          <a
            href={screenshotUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-[12px] underline underline-offset-4 opacity-80 hover:opacity-100"
          >
            View uploaded screenshot ↗
          </a>
        )}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/track-order" className="btn-dark">
          Track order
        </Link>
        <Link href="/" className="btn-ghost">
          Back to home
        </Link>
      </div>
    </div>
  );
}
