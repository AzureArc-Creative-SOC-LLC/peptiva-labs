"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { resetPassword } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { friendlyPasswordError } from "@/lib/errors";

function ResetInner() {
  const router = useRouter();
  const search = useSearchParams();
  const toast = useToast();
  const tokenFromUrl = search.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tokenFromUrl) setToken(tokenFromUrl);
  }, [tokenFromUrl]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    if (!token.trim()) {
      toast.error(
        "Please paste the reset token from your email, or open the link we sent you.",
        "Reset token missing"
      );
      return;
    }
    if (password.length < 6) {
      toast.error(
        "Please choose a password with at least 6 characters.",
        "Password too short"
      );
      return;
    }
    if (password !== confirm) {
      toast.error(
        "The two passwords don't match. Please try again.",
        "Passwords don't match"
      );
      return;
    }

    setLoading(true);
    try {
      const r = await resetPassword(token, password);
      toast.success(
        r.message || "Your password has been reset. You can sign in now.",
        "Password updated"
      );
      // Give the shopper a beat to read the toast, then send them to sign in.
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      if (typeof console !== "undefined") console.error("reset-password failed:", err);
      toast.error(friendlyPasswordError(err), "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="text-[11px] uppercase tracking-label text-ink-muted">
        Peptiva Labs · Choose a new password
      </p>
      <h1 className="mt-2 text-[clamp(36px,5vw,56px)] font-medium leading-[1] tracking-tight2 text-ink">
        Reset password
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
        {!tokenFromUrl && (
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium text-ink">Reset token</span>
            <input
              type="text"
              required
              placeholder="Paste the token from your email"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="rounded-xl border border-line bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-subtle focus:border-ink/30"
            />
          </label>
        )}
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium text-ink">New password</span>
          <input
            type="password"
            required
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-line bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-subtle focus:border-ink/30"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium text-ink">Confirm password</span>
          <input
            type="password"
            required
            placeholder="Re-enter password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="rounded-xl border border-line bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-subtle focus:border-ink/30"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="btn-dark mt-2 w-full justify-center disabled:opacity-60"
        >
          {loading ? "Resetting…" : "Reset password"}
        </button>
      </form>

      <p className="mt-5 text-[13px] text-ink-secondary">
        <Link href="/login" className="text-ink hover:opacity-70">
          ← Back to sign in
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <main className="section-block bg-canvas pb-24 pt-28 sm:pt-32">
        <div className="container-fluid">
          <Suspense fallback={<div className="text-ink-secondary">Loading…</div>}>
            <ResetInner />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
