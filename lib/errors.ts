// Shopper-friendly error copy for user-facing flows. Raw errors from the API
// (HTTP status codes, upstream messages) are still logged to the console for
// engineers — these helpers only produce the string the UI shows.

import { ApiError } from "./api";

type Flow = "checkout" | "login" | "register" | "generic";

const GENERIC_UNAVAILABLE =
  "Our service is briefly unavailable. Please try again in a minute.";
const GENERIC_NETWORK =
  "We couldn't reach the server. Check your connection and try again.";
const GENERIC_RATE_LIMIT =
  "Too many attempts in a short time. Please wait a moment and try again.";
const GENERIC_SERVER =
  "Something went wrong on our side. Please try again in a moment.";
const GENERIC_UNKNOWN = "Something went wrong. Please try again in a moment.";

function commonMessage(status: number, flow: Flow): string | null {
  if (status === 429) return GENERIC_RATE_LIMIT;
  if (status === 502 || status === 503 || status === 504) {
    // Login has a specific 503 from the docs ("Login temporarily unavailable").
    if (flow === "login") {
      return "Sign-in is temporarily unavailable. Please try again in a moment.";
    }
    return GENERIC_UNAVAILABLE;
  }
  if (status >= 500) return GENERIC_SERVER;
  return null;
}

/** Checkout — POST /api/user-orders. */
export function friendlyOrderError(e: unknown): string {
  if (e instanceof ApiError) {
    const raw = (e.message || "").toLowerCase();

    if (e.status === 403) {
      return "We couldn't process this order. Please contact support if you think this is a mistake.";
    }

    // The service throws a generic 500 for a missing/invalid email — surface
    // it as a form-level hint instead of a server error.
    if (raw.includes("missing") && raw.includes("email")) {
      return "Please double-check your email address and try again.";
    }
    if (raw.includes("invalid") && raw.includes("email")) {
      return "That email address doesn't look right. Please check and try again.";
    }

    const common = commonMessage(e.status, "checkout");
    if (common) return common;

    if (e.status >= 400) {
      return "We couldn't complete your order. Please review your details and try again.";
    }
    return GENERIC_NETWORK;
  }
  return "We couldn't place your order right now. Please try again in a moment.";
}

/** Sign-in — POST /api/auth/login. */
export function friendlyLoginError(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.status === 401) {
      return "That email and password don't match. Please try again.";
    }
    if (e.status === 400) {
      return "Please enter both your email and password.";
    }
    const common = commonMessage(e.status, "login");
    if (common) return common;
    if (e.status >= 400) {
      return "We couldn't sign you in. Please check your details and try again.";
    }
    return GENERIC_NETWORK;
  }
  return GENERIC_UNKNOWN;
}

/** Forgot / reset password — POST /api/auth/forgot-password + /reset-password. */
export function friendlyPasswordError(e: unknown): string {
  if (e instanceof ApiError) {
    const raw = (e.message || "").toLowerCase();

    if (e.status === 400) {
      if (raw.includes("expired") || raw.includes("invalid")) {
        return "That reset link is invalid or has expired. Please request a new one.";
      }
      if (raw.includes("password")) {
        return "Please choose a password with at least 6 characters.";
      }
      return "Please enter a valid email address.";
    }
    const common = commonMessage(e.status, "generic");
    if (common) return common;
    if (e.status >= 400) {
      return "We couldn't process that request. Please try again.";
    }
    return GENERIC_NETWORK;
  }
  return GENERIC_UNKNOWN;
}

/** Registration — POST /api/auth/register. */
export function friendlyRegisterError(e: unknown): string {
  if (e instanceof ApiError) {
    const raw = (e.message || "").toLowerCase();

    if (e.status === 400) {
      if (raw.includes("password")) {
        return "Please choose a password with at least 6 characters.";
      }
      if (raw.includes("email")) {
        return "That email address doesn't look right. Please check and try again.";
      }
      if (raw.includes("date_of_birth") || raw.includes("date of birth")) {
        return "Please enter your date of birth.";
      }
      if (raw.includes("nationality")) return "Please enter your nationality.";
      if (raw.includes("country")) return "Please enter your country of residence.";
      if (raw.includes("name")) return "Please enter your full name.";
      return "Please fill in all the required fields and try again.";
    }
    const common = commonMessage(e.status, "register");
    if (common) return common;
    if (e.status >= 400) {
      return "We couldn't create your account. Please review your details and try again.";
    }
    return GENERIC_NETWORK;
  }
  return GENERIC_UNKNOWN;
}
