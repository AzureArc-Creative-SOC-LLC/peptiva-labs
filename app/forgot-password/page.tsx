"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { forgotPassword } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { friendlyPasswordError } from "@/lib/errors";

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const r = await forgotPassword(email);
      toast.success(
        r.message ||
          "If an account exists with this email, a password reset link has been sent.",
        "Check your inbox"
      );
      setEmail("");
    } catch (err) {
      if (typeof console !== "undefined") console.error("forgot-password failed:", err);
      toast.error(friendlyPasswordError(err), "Reset link not sent");
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
              Peptiva Labs · Password reset
            </p>
            <h1 className="mt-2 text-[clamp(36px,5vw,56px)] font-medium leading-[1] tracking-tight2 text-blue-600">
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
