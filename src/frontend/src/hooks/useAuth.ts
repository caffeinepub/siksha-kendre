import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export function useAuth() {
  const { login, clear, isLoginSuccess, identity, loginStatus } =
    useInternetIdentity();
  const queryClient = useQueryClient();
  const [loginError, setLoginError] = useState<string | null>(null);
  // Local flag for immediate UI feedback — set BEFORE the await, cleared in finally.
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);
  // Guard against double-invocation in Strict Mode / concurrent renders.
  const loginInFlightRef = useRef(false);

  const isAuthenticated = !!identity && isLoginSuccess;

  // isLoading:
  //   - True only while we're actively in a login attempt OR the II hook is initializing.
  //   - 'idle' alone is NOT treated as loading — it's the stable "not logged in" state.
  //   - Never stays true indefinitely; 'idle'/'loginError' with no identity → show login page.
  const isLoading =
    isLoginInProgress ||
    loginStatus === "logging-in" ||
    loginStatus === "initializing";

  // Watch loginStatus transitions so we always stay in sync with the underlying hook,
  // even if the login Promise resolves before the status updates (race on live).
  useEffect(() => {
    if (loginStatus === "success") {
      // Login succeeded — clear any in-progress/error state.
      setIsLoginInProgress(false);
      setLoginError(null);
      loginInFlightRef.current = false;
      queryClient.invalidateQueries().catch(() => {});
    } else if (loginStatus === "loginError") {
      // Hook itself reached an error state.
      setIsLoginInProgress(false);
      loginInFlightRef.current = false;
      setLoginError((prev) =>
        prev
          ? prev
          : "Login failed. Please allow pop-ups for this site and try again.",
      );
    }
  }, [loginStatus, queryClient]);

  const handleLogin = async () => {
    // Prevent concurrent calls.
    if (loginInFlightRef.current) return;
    loginInFlightRef.current = true;

    setLoginError(null);
    setIsLoginInProgress(true);

    try {
      await login();
      // On success the useEffect above will fire as loginStatus → 'success'.
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      const msgLower = msg.toLowerCase();

      // "already authenticated" — clear the stale session and retry once.
      if (msgLower.includes("already")) {
        try {
          await clear();
          await new Promise<void>((resolve) => setTimeout(resolve, 400));
          await login();
          // If retry succeeded, useEffect will handle state cleanup.
          return;
        } catch (retryError: unknown) {
          const retryMsg =
            retryError instanceof Error
              ? retryError.message
              : String(retryError);
          const retryLower = retryMsg.toLowerCase();
          console.error("Login retry error:", retryError);
          setLoginError(
            retryLower.includes("cancel") || retryLower.includes("closed")
              ? "Login was cancelled. Please try again."
              : "Login failed after retry. Please refresh the page and try again.",
          );
        }
      } else if (
        msgLower.includes("popup") ||
        msgLower.includes("blocked") ||
        msgLower.includes("window")
      ) {
        setLoginError(
          "Pop-up was blocked. Please allow pop-ups for this site in your browser and try again.",
        );
      } else if (
        msgLower.includes("cancel") ||
        msgLower.includes("closed") ||
        msgLower.includes("abort")
      ) {
        setLoginError("Login was cancelled. Please try again.");
      } else {
        console.error("Login error:", error);
        setLoginError(
          `Login failed: ${msg}. Please allow pop-ups for this site and try again.`,
        );
      }
    } finally {
      // Always clear the in-progress flags so the button is never stuck.
      setIsLoginInProgress(false);
      loginInFlightRef.current = false;
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return {
    isAuthenticated,
    isLoading,
    identity,
    login: handleLogin,
    logout: handleLogout,
    isLoginSuccess,
    loginError,
    loginStatus,
  };
}
