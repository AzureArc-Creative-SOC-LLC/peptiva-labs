"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthContext";
import { ApiError } from "@/lib/api";

function RegisterInner() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/account";
  const { register, loading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    date_of_birth: "",
    nationality: "",
    country_of_residence: "",
  });
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    try {
      await register(form);
      router.push(next);
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Registration failed"
      );
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <p className="text-[11px] uppercase tracking-label text-ink-muted">
        Get started
      </p>
      <h1 className="mt-2 text-[clamp(36px,5vw,56px)] font-medium leading-[1] tracking-tight2 text-ink">
        Create account
      </h1>
      <p className="mt-3 text-[14px] text-ink-secondary">
        Register to track orders, earn wallet credit, and access the affiliate
        program.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid grid-cols-1 gap-4 rounded-card border border-line bg-white p-6 sm:grid-cols-2 sm:p-8"
      >
        <TextField
          label="Full name"
          value={form.name}
          onChange={(v) => update("name", v)}
          placeholder="Jane Doe"
          required
          full
          autoComplete="name"
        />
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => update("email", v)}
          placeholder="you@lab.com"
          required
          full
          autoComplete="email"
        />
        <TextField
          label="Password"
          type="password"
          value={form.password}
          onChange={(v) => update("password", v)}
          placeholder="At least 6 characters"
          required
          full
          autoComplete="new-password"
        />
        <TextField
          label="Date of birth"
          type="date"
          value={form.date_of_birth}
          onChange={(v) => update("date_of_birth", v)}
          required
          autoComplete="bday"
        />
        <TextField
          label="Nationality"
          value={form.nationality}
          onChange={(v) => update("nationality", v)}
          placeholder="Emirati"
          required
        />
        <TextField
          label="Country of residence"
          value={form.country_of_residence}
          onChange={(v) => update("country_of_residence", v)}
          placeholder="United Arab Emirates"
          required
          full
          autoComplete="country-name"
        />

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700 sm:col-span-2"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-dark mt-2 w-full justify-center disabled:opacity-60 sm:col-span-2"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-5 text-[13px] text-ink-secondary">
        Already have an account?{" "}
        <Link
          href={`/login${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="text-ink hover:opacity-70"
        >
          Sign in →
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="section-block bg-canvas pb-24 pt-28 sm:pt-32">
        <div className="container-fluid">
          <Suspense fallback={<div className="text-ink-secondary">Loading…</div>}>
            <RegisterInner />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

function TextField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  full = false,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  full?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-[12px] font-medium text-ink">{label}</span>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-line bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-subtle focus:border-ink/30"
      />
    </label>
  );
}
