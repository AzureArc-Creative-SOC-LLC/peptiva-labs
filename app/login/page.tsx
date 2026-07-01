"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { ApiError } from "@/lib/api";

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/account";
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      router.push(next);
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Login failed"
      );
    }
  }

  return (
    <div className="w-full max-w-md">
      <p className="text-[11px] uppercase tracking-label text-ink-muted">
        Welcome back
      </p>
      <h1 className="mt-2 text-[clamp(32px,4.4vw,44px)] font-medium leading-[1.05] tracking-tight2 text-ink">
        Sign in to Lunvera
      </h1>
      <p className="mt-3 text-[14px] text-ink-secondary">
        Access your orders, wallet balance and affiliate dashboard.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@lab.com"
          required
          autoComplete="email"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          }
        />

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-[12px] font-medium text-ink"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[12px] text-ink-secondary hover:text-ink"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative mt-1.5">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <input
              id="password"
              type={showPw ? "text" : "password"}
              required
              placeholder="••••••••"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-line bg-white pl-10 pr-16 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-subtle focus:border-ink/30"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-pressed={showPw}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-[11px] font-medium text-ink-secondary transition-colors hover:bg-canvas hover:text-ink"
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-dark mt-2 w-full justify-center disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-[13px] text-ink-secondary">
        Don&rsquo;t have an account?{" "}
        <Link
          href={`/register${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-medium text-ink hover:opacity-70"
        >
          Create one →
        </Link>
      </p>

      <p className="mt-6 flex items-center gap-2 text-[11px] text-ink-muted">
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
          <rect x="1" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M3 6V4a3 3 0 1 1 6 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        Encrypted end-to-end. Sessions expire after 30 days.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Brand / visual panel */}
        <aside className="relative hidden overflow-hidden bg-ink_btn lg:block">
          <Image
            src="/images/lab1.jpg"
            alt=""
            fill
            sizes="50vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ink_btn/85 via-ink_btn/70 to-ink_btn/95" />
          <div className="relative flex h-full flex-col justify-between p-10 text-white xl:p-14">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[13px] font-medium tracking-tight text-white/90 hover:text-white"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M4 20l8-14 8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Lunvera
            </Link>

            <div className="max-w-md">
              <p className="text-[11px] uppercase tracking-label text-white/60">
                Research-grade peptides
              </p>
              <h2 className="mt-3 text-[clamp(32px,3.6vw,44px)] font-medium leading-[1.05] tracking-tight2 text-white">
                Verified sourcing.
                <br />
                Sealed handling.
                <br />
                Direct from Dubai.
              </h2>
              <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-white/70">
                Sign in to track shipments, redeem wallet credit and manage your
                affiliate promo code.
              </p>
            </div>

            <div className="flex items-center gap-6 text-[12px] text-white/60">
              <div>
                <p className="text-[22px] font-medium text-white">99.4%</p>
                <p className="mt-0.5">Verified purity</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <p className="text-[22px] font-medium text-white">24/7</p>
                <p className="mt-0.5">Cold-chain support</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Form panel */}
        <section className="relative flex items-center justify-center px-5 py-14 sm:px-10">
          <Link
            href="/"
            className="absolute left-5 top-6 inline-flex items-center gap-2 text-[13px] text-ink-secondary transition-colors hover:text-ink lg:hidden"
          >
            ← Back to home
          </Link>
          <Link
            href="/"
            className="absolute right-5 top-6 text-[12px] text-ink-muted transition-colors hover:text-ink"
          >
            lunvera.com
          </Link>

          <Suspense
            fallback={<div className="text-ink-secondary">Loading…</div>}
          >
            <LoginInner />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  icon,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-ink">{label}</span>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
            {icon}
          </span>
        )}
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border border-line bg-white ${icon ? "pl-10" : "pl-4"} pr-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-subtle focus:border-ink/30`}
        />
      </div>
    </label>
  );
}
