"use client";

// Framework-free toast system. Keeps the site free of a third-party toast
// dependency while matching the existing modern design language (rounded
// cards, ink colors, subtle shadow, smooth motion).

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ToastVariant = "success" | "error" | "info";

export type ToastInput = {
  title?: string;
  description: string;
  variant?: ToastVariant;
  /** Milliseconds until auto-dismiss. 0 = sticky. */
  duration?: number;
};

type Toast = Required<Omit<ToastInput, "duration">> & {
  id: number;
  duration: number;
};

type ToastContextValue = {
  show: (t: ToastInput) => number;
  success: (description: string, title?: string) => number;
  error: (description: string, title?: string) => number;
  info: (description: string, title?: string) => number;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;
const DEFAULTS: Record<ToastVariant, { duration: number; title: string }> = {
  success: { duration: 4500, title: "Success" },
  error: { duration: 7000, title: "Something went wrong" },
  info: { duration: 5000, title: "" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (t: ToastInput) => {
      const variant = t.variant ?? "info";
      const defaults = DEFAULTS[variant];
      const id = nextId++;
      const toast: Toast = {
        id,
        title: t.title ?? defaults.title,
        description: t.description,
        variant,
        duration: t.duration ?? defaults.duration,
      };
      setToasts((prev) => [...prev, toast]);
      if (toast.duration > 0) {
        const timer = setTimeout(() => dismiss(id), toast.duration);
        timers.current.set(id, timer);
      }
      return id;
    },
    [dismiss]
  );

  const success = useCallback(
    (description: string, title?: string) =>
      show({ description, title, variant: "success" }),
    [show]
  );
  const error = useCallback(
    (description: string, title?: string) =>
      show({ description, title, variant: "error" }),
    [show]
  );
  const info = useCallback(
    (description: string, title?: string) =>
      show({ description, title, variant: "info" }),
    [show]
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);

  const value = useMemo(
    () => ({ show, success, error, info, dismiss }),
    [show, success, error, info, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 top-20 z-[80] flex flex-col items-center gap-3 px-4 sm:inset-x-auto sm:right-6 sm:top-24 sm:items-end sm:px-0"
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const palette = {
    success: {
      icon: "bg-emerald-100 text-emerald-700",
      accent: "text-emerald-700",
    },
    error: {
      icon: "bg-red-100 text-red-700",
      accent: "text-red-700",
    },
    info: {
      icon: "bg-ink/10 text-ink",
      accent: "text-ink",
    },
  }[toast.variant];

  return (
    <div
      role={toast.variant === "error" ? "alert" : "status"}
      className={[
        "pointer-events-auto w-full max-w-sm overflow-hidden rounded-card border border-line bg-white shadow-card",
        "transform-gpu transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        entered
          ? "translate-y-0 opacity-100"
          : "-translate-y-4 opacity-0 sm:translate-x-4 sm:translate-y-0",
      ].join(" ")}
    >
      <div className="flex items-start gap-3 p-4">
        <span
          className={`mt-0.5 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full ${palette.icon}`}
          aria-hidden
        >
          <ToastIcon variant={toast.variant} />
        </span>
        <div className="min-w-0 flex-1">
          {toast.title ? (
            <p className={`text-[13px] font-medium ${palette.accent}`}>
              {toast.title}
            </p>
          ) : null}
          <p className="mt-0.5 text-[13px] leading-relaxed text-ink-secondary">
            {toast.description}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss"
          className="ml-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-canvas hover:text-ink"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 3l6 6M9 3l-6 6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ToastIcon({ variant }: { variant: ToastVariant }) {
  if (variant === "success") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 12.5l4 4 10-10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (variant === "error") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M12 8v5m0 2.5v.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 10.5v6m0-9v.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
