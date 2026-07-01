"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ApiError,
  login as apiLogin,
  register as apiRegister,
  verifyToken,
  type ApiUser,
} from "@/lib/api";
import {
  clearToken,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from "@/lib/auth";

type AuthContextValue = {
  user: ApiUser | null;
  hydrated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<ApiUser>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    date_of_birth: string;
    nationality: string;
    country_of_residence: string;
  }) => Promise<ApiUser>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage first for instant UI, then verify with the server.
    const stored = getStoredUser();
    if (stored) setUser(stored);
    setHydrated(true);

    const token = getToken();
    if (!token) return;

    verifyToken()
      .then((r) => {
        setUser(r.user);
        setStoredUser(r.user);
      })
      .catch((e) => {
        // Only sign out on an explicit auth rejection.
        // Network/timeout errors keep the cached session so the UI stays usable.
        if (e instanceof ApiError && e.status === 401) {
          clearToken();
          setUser(null);
        }
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const r = await apiLogin({ email, password });
      setToken(r.token);
      setStoredUser(r.user);
      setUser(r.user);
      return r.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (payload: {
      name: string;
      email: string;
      password: string;
      date_of_birth: string;
      nationality: string;
      country_of_residence: string;
    }) => {
      setLoading(true);
      try {
        const r = await apiRegister(payload);
        setToken(r.token);
        setStoredUser(r.user);
        setUser(r.user);
        return r.user;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const r = await verifyToken();
      setUser(r.user);
      setStoredUser(r.user);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        clearToken();
        setUser(null);
      }
    }
  }, []);

  const value = useMemo(
    () => ({ user, hydrated, loading, login, register, logout, refresh }),
    [user, hydrated, loading, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
