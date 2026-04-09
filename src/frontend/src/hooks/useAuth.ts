import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const { login, clear, isLoginSuccess, identity, loginStatus } =
    useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity && isLoginSuccess;
  // 'idle' means the session-restore phase hasn't completed yet — treat as loading
  // to prevent the login page from flashing before the identity is resolved.
  const isLoading =
    loginStatus === "logging-in" ||
    loginStatus === "initializing" ||
    (loginStatus === "idle" && identity === undefined);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === "User is already authenticated"
      ) {
        await clear();
        setTimeout(() => login(), 300);
      } else {
        console.error("Login error:", error);
      }
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
  };
}
