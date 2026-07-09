// User Order service API client.
//
// Docs: API_DOCUMENTATION-USER-ORDER.md (User Order Service).
//
// Base URL: by default this is empty (relative to the site's own origin).
// The backend does not send CORS headers for arbitrary origins, so browser
// requests go to `/api/*` and Next.js rewrites (see next.config.mjs) proxy
// them to the upstream service — same-origin from the browser's perspective.
// Set `NEXT_PUBLIC_API_BASE` to force absolute calls (e.g. for tools that
// consume this module outside the Next.js runtime).

import { getToken } from "./auth";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type Query = Record<string, string | number | boolean | undefined | null>;

function buildUrl(path: string, query?: Query): string {
  const absolute = path.startsWith("http");
  const raw = absolute ? path : `${API_BASE}${path}`;
  // Same-origin relative paths (`/api/...`) are only valid URLs once we know
  // the origin. In the browser we resolve against `location`; on the server
  // we fall back to a placeholder just to use URL's query serialization.
  const base =
    absolute || raw.startsWith("http")
      ? undefined
      : typeof window !== "undefined"
        ? window.location.origin
        : "www.microservices.tech";
  const url = new URL(raw, base);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    });
  }
  // If the caller passed a relative path (no explicit base), keep the fetch
  // relative so browsers use the current origin and Next.js rewrites apply.
  if (!absolute && !raw.startsWith("http")) {
    return `${url.pathname}${url.search}`;
  }
  return url.toString();
}

function pickErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.error === "string") return d.error;
    if (typeof d.message === "string") return d.message;
  }
  return fallback;
}

const DEFAULT_TIMEOUT_MS = 12_000;

async function request<T>(
  method: string,
  path: string,
  opts: {
    query?: Query;
    json?: unknown;
    form?: FormData;
    auth?: boolean;
    signal?: AbortSignal;
    timeoutMs?: number;
  } = {}
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  let body: BodyInit | undefined;

  if (opts.form) {
    body = opts.form;
    // Do NOT set Content-Type — the browser sets the multipart boundary.
  } else if (opts.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.json);
  }

  if (opts.auth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }

  // Set up a timeout AbortController that respects any caller-provided signal.
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  if (opts.signal) {
    if (opts.signal.aborted) controller.abort();
    else opts.signal.addEventListener("abort", () => controller.abort());
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(path, opts.query), {
      method,
      headers,
      body,
      signal: controller.signal,
    });
  } catch (e) {
    clearTimeout(timer);
    const aborted =
      (e instanceof DOMException && e.name === "AbortError") ||
      controller.signal.aborted;
    throw new ApiError(
      aborted
        ? `Request timed out after ${Math.round(timeoutMs / 1000)}s`
        : e instanceof Error
          ? e.message
          : "Network error",
      0,
      null
    );
  }

  clearTimeout(timer);

  // Some 204s / redirects may have no body.
  const ct = res.headers.get("content-type") || "";
  let data: unknown = null;
  if (ct.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await res.text();
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    throw new ApiError(
      pickErrorMessage(data, `HTTP ${res.status}`),
      res.status,
      data
    );
  }
  return data as T;
}

export const api = {
  get: <T>(path: string, opts?: Parameters<typeof request>[2]) =>
    request<T>("GET", path, opts),
  post: <T>(path: string, opts?: Parameters<typeof request>[2]) =>
    request<T>("POST", path, opts),
  put: <T>(path: string, opts?: Parameters<typeof request>[2]) =>
    request<T>("PUT", path, opts),
  del: <T>(path: string, opts?: Parameters<typeof request>[2]) =>
    request<T>("DELETE", path, opts),
};

// -----------------------------
// Typed endpoint helpers
// -----------------------------

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  country_of_residence: string | null;
  role: string;
};

export type AuthResponse = {
  success: true;
  token: string;
  user: ApiUser;
};

export function register(payload: {
  name: string;
  email: string;
  password: string;
  date_of_birth: string;
  nationality: string;
  country_of_residence: string;
}) {
  return api.post<AuthResponse>("/api/auth/register", { json: payload });
}

export function login(payload: { email: string; password: string }) {
  return api.post<AuthResponse>("/api/auth/login", { json: payload });
}

export function verifyToken() {
  return api.get<{ success: true; user: ApiUser }>("/api/auth/verify", {
    auth: true,
  });
}

export function forgotPassword(email: string) {
  return api.post<{ success: true; message: string }>(
    "/api/auth/forgot-password",
    { json: { email } }
  );
}

export function resetPassword(token: string, password: string) {
  return api.post<{ success: true; message: string }>(
    "/api/auth/reset-password",
    { json: { token, password } }
  );
}

// Promo
export function validatePromo(code: string) {
  return api.post<{ ok: true; valid: true; percent: number }>(
    "/api/promos/validate",
    { json: { code } }
  );
}

// Orders — POST /api/user-orders (primary checkout endpoint).
//
// Field names below use the documented aliases exactly. The service also
// accepts other spellings (customerEmail/shippingAddress/etc.) per the
// aliasing rules in API_DOCUMENTATION-USER-ORDER, but this shape is what the
// endpoint reads first.
export type UserOrderItemPayload = {
  productId?: string | number;
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
};

export type UserOrderPayload = {
  email: string;
  firstName?: string;
  lastName?: string;
  customerName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postcode?: string;
  country?: string;
  orderId?: string;
  promoCode?: string;
  promoDiscount?: number;
  subtotal: number;
  discountAmount?: number;
  total: number;
  createdAtIso?: string;
  items: UserOrderItemPayload[];
  paymentMethod?: "manual" | string;
};

export type UserOrderResponse = {
  success: true;
  // Despite the field name, `orderId` is the order-number string, not a numeric DB id.
  orderId: string;
  orderNumber: string;
  email_debug?: {
    paymentLinkCreated?: boolean;
    orderConfirmation?: { attempted: boolean; ok: boolean; error: string | null };
    paymentCapture?: { attempted: boolean; ok: boolean; error: string | null };
  };
};

export function createUserOrder(payload: UserOrderPayload) {
  return api.post<UserOrderResponse>("/api/user-orders", {
    json: payload,
    timeoutMs: 30_000,
  });
}

// Order lookup — matches the `orders` table row shape from
// API_DOCUMENTATION-USER-ORDER. Monetary fields come back as strings
// (Postgres NUMERIC/DECIMAL) — the UI runs them through `toNumber` before
// formatting.
export type OrderRow = {
  id: number;
  order_number: string;
  user_id?: number | null;
  customer_email: string;
  customer_name?: string | null;
  customer_phone?: string | null;
  shipping_address?: string | null;
  shipping_city?: string | null;
  shipping_state?: string | null;
  shipping_zip?: string | null;
  shipping_country?: string | null;
  tracking_number?: string | null;
  currency?: string;
  subtotal?: number | string;
  shipping?: number | string;
  total?: number | string;
  status: string;
  payment_status: string;
  payment_method?: string;
  promo_code?: string | null;
  promo_discount?: string | number | null;
  discount_amount?: number | string | null;
  created_at: string;
  updated_at?: string;
  items_text?: string | null;
};

export function getOrdersByEmail(email: string) {
  return api.get<{ orders: OrderRow[] }>("/api/user-orders/by-email", {
    query: { email },
  });
}

// Wallet + affiliate
export type WalletLedgerEntry = {
  amount: number;
  source: string;
  order_number: string | null;
  admin_username: string | null;
  note: string | null;
  created_at: string;
};

export function getWallet() {
  return api.get<{ success: true; balance: number; ledger: WalletLedgerEntry[] }>(
    "/api/wallet",
    { auth: true }
  );
}

export type AffiliateStatus =
  | { ok: true; hasRequest: false }
  | {
      ok: true;
      hasRequest: true;
      request: {
        id: number;
        status: string;
        promo_code: string;
        promo_percent: number;
        created_at: string;
        decided_at: string | null;
      };
    };

export function getAffiliateStatus() {
  return api.get<AffiliateStatus>("/api/affiliate/status", { auth: true });
}

export function requestAffiliate(payload: {
  first_name: string;
  last_name: string;
  tiktok_link: string;
}) {
  return api.post<{
    ok: true;
    approved?: boolean;
    alreadyRequested?: boolean;
    status: string;
    promo_code: string;
    promo_percent: number;
    reward_amount: number;
  }>("/api/affiliate/request", { json: payload, auth: true });
}

export type AffiliateDashboard =
  | { ok: true; is_affiliate: false }
  | {
      ok: true;
      is_affiliate: true;
      promo_code: string;
      promo_percent: number;
      reward_amount: number;
      status: string;
      first_name: string;
      last_name: string;
      tiktok_link: string;
      wallet_balance: number;
      total_earned: number;
      unique_customers: number;
      recent_redemptions: Array<{
        order_number: string;
        customer_email_masked: string;
        reward_amount: number;
        created_at: string;
      }>;
    };

export function getAffiliateDashboard() {
  return api.get<AffiliateDashboard>("/api/affiliate/dashboard", {
    auth: true,
  });
}

// Order detail
export type OrderItemRow = {
  id: number;
  order_id: number;
  product_id: number | null;
  sku: string | null;
  name: string;
  quantity: number;
  unit_price: number | string;
  line_total: number | string;
};

export type PaymentRow = {
  id: number;
  order_id: number;
  provider: string;
  provider_id: string;
  amount: number | string;
  currency: string;
  status: string;
  created_at: string;
  updated_at?: string;
};

export function getOrder(orderNumber: string) {
  return api.get<{
    order: OrderRow;
    items: OrderItemRow[];
    payments: PaymentRow[];
  }>(`/api/user-orders/${encodeURIComponent(orderNumber)}`);
}

// Payment capture (manual bank-transfer flow)
export type BankDetails = {
  payeeName: string;
  sortCode: string;
  accountNumber: string;
  reference: string;
};

export type PaymentCaptureContext = {
  ok: true;
  order: OrderRow;
  items: OrderItemRow[];
  payments: PaymentRow[];
  allowPromo: boolean;
  bank: BankDetails;
};

export function validateCaptureToken(token: string) {
  return api.post<PaymentCaptureContext>("/api/payment-capture/validate", {
    json: { token },
  });
}

export function applyCapturePromo(token: string, promoCode: string) {
  return api.post<{
    ok: true;
    promoCode: string;
    promoDiscountPercent: number;
    discountAmount: number;
    total: number;
  }>("/api/payment-capture/apply-promo", { json: { token, promoCode } });
}

export function uploadCaptureScreenshot(token: string, file: File) {
  const form = new FormData();
  form.append("token", token);
  form.append("paymentScreenshot", file);
  return api.post<{
    ok: true;
    screenshotUrl: string;
    screenshotFilename: string;
    verification: unknown;
    payment_status: "received" | "rejected" | "pending";
    verification_error?: string;
  }>("/api/payment-capture/upload", { form, timeoutMs: 60_000 });
}

// AI chat
export type ChatMessage = { role: "user" | "assistant"; text: string };

export function aiChat(payload: { message: string; history?: ChatMessage[] }) {
  return api.post<{
    reply: string;
    sources?: Array<{ id: string; title: string }>;
    provider?: string;
  }>("/api/ai-chat", { json: payload });
}

export function aiChatSuggestions() {
  return api.get<{ suggestions: string[] }>("/api/ai-chat/suggestions");
}

// Newsletter
export function newsletterSubscribe(payload: {
  email: string;
  consent: boolean;
  source?: string;
  website?: string;
}) {
  return api.post<{ ok: true; id?: number; already_subscribed?: boolean }>(
    "/api/newsletter/subscribe",
    { json: payload }
  );
}
