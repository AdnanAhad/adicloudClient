"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GitHubUser } from "../types/types";

export type UserState = {
  user: GitHubUser | null;
  isLoggedIn: boolean;
  loading: boolean; // initial session loading
  error: string | null;
  authLoading: boolean; // login/logout in progress
  authAction: "login" | "logout" | null;
};

export type UserContextValue = UserState & {
  refresh: () => Promise<void>;
  login: () => void;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authAction, setAuthAction] = useState<"login" | "logout" | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
        {
          credentials: "include",
        }
      );

      if (res.status === 200) {
        const data = (await res.json()) as GitHubUser;
        setUser(data);
      } else if (res.status === 401) {
        setUser(null);
      } else {
        setError(`Unexpected status: ${res.status}`);
        setUser(null);
      }
    } catch (e: unknown) {
      setError((e as Error)?.message ?? "Failed to fetch user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(() => {
    setAuthAction("login");
    setAuthLoading(true);
    if (typeof window !== "undefined") {
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/github`;
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthAction("logout");
    setAuthLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore network errors on logout
    } finally {
      setUser(null);
      if (
        typeof window !== "undefined" &&
        process.env.NEXT_PUBLIC_FRONTEND_URL
      ) {
        window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}`;
      } else {
        setAuthLoading(false);
        setAuthAction(null);
      }
    }
  }, []);

  useEffect(() => {
    // Attempt to restore session on mount
    refresh();
  }, [refresh]);

  const value: UserContextValue = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      loading,
      error,
      authLoading,
      authAction,
      refresh,
      login,
      logout,
    }),
    [user, loading, error, authLoading, authAction, refresh, login, logout]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextValue => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
};
