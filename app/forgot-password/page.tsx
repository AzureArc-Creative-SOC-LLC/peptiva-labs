"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ApiError, forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSent(null);
    setLoading(true);
    try {
      const r = await forgotPassword(email);
      setSent(r.message);
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Request failed"
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
          <div className="mx-auto w-full max-w-md">
            <p className="text-[11px] uppercase tracking-label text-ink-muted">
              Password reset
            </p>
            <h1 className="mt-2 text-[clamp(36px,5vw,56px)] font-medium leading-[1] tracking-tight2 text-ink">
              Forgot password
            </h1>
            <p className="mt-3 text-[14px] text-ink-secondary">
              Enter the email on your account and we&rsquo;ll send a reset link.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-medium text-ink">Email</span>
                <input
                  type="email"
                  required
                  placeholder="you@lab.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border border-line bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-subtle focus:border-ink/30"
                />
              </label>

              {sent && (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[13px] text-emerald-800">
                  {sent}
                </p>
              )}
              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-dark mt-2 w-full justify-center disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>

            <p className="mt-5 text-[13px] text-ink-secondary">
              Remembered it?{" "}
              <Link href="/login" className="text-ink hover:opacity-70">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
