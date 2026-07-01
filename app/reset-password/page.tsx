"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ApiError, resetPassword } from "@/lib/api";

function ResetInner() {
  const router = useRouter();
  const search = useSearchParams();
  const tokenFromUrl = search.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tokenFromUrl) setToken(tokenFromUrl);
  }, [tokenFromUrl]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const r = await resetPassword(token, password);
      setDone(r.message);
      setTimeout(() => router.push("/login"), 1500);
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Reset failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="text-[11px] uppercase tracking-label text-ink-muted">
        Choose a new password
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

        {done && (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[13px] text-emerald-800">
            {done} Redirecting…
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
