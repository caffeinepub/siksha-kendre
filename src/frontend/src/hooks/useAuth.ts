import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { createActor } from "../backend";
import type { UserRole } from "../backend.d";

const TOKEN_KEY = "sk_session_token";

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
  role: UserRole | null;
  token: string | null;
  loginError: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): AuthState {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // On mount / actor ready: validate stored token
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!actor) return;
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    actor
      .getSession(storedToken)
      .then((info) => {
        if (info) {
          setToken(storedToken);
          setUsername(info.username);
          setRole(info.role);
        } else {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, [actor]);

  const login = async (u: string, p: string) => {
    if (!actor) throw new Error("Not connected");
    setLoginError(null);
    const result = await actor.login(u.trim(), p);
    if (result.__kind__ === "err") {
      setLoginError(result.err);
      return;
    }
    const newToken = result.ok;
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    const info = await actor.getSession(newToken);
    if (info) {
      setUsername(info.username);
      setRole(info.role);
    }
    queryClient.invalidateQueries().catch(() => {});
  };

  const signup = async (u: string, p: string) => {
    if (!actor) throw new Error("Not connected");
    setLoginError(null);
    const result = await actor.signup(u.trim(), p);
    if (result.__kind__ === "err") {
      setLoginError(result.err);
      return;
    }
    const newToken = result.ok;
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    const info = await actor.getSession(newToken);
    if (info) {
      setUsername(info.username);
      setRole(info.role);
    }
    queryClient.invalidateQueries().catch(() => {});
  };

  const logout = async () => {
    if (actor && token) {
      await actor.logout(token).catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUsername(null);
    setRole(null);
    queryClient.clear();
  };

  return {
    isAuthenticated: !!token && !!username,
    isLoading,
    username,
    role,
    token,
    loginError,
    login,
    signup,
    logout,
  };
}
