import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, GraduationCap, Loader2, Lock, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login, signup, isLoading, loginError } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const error = localError || loginError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!username.trim()) {
      setLocalError("Username is required.");
      return;
    }
    if (!password) {
      setLocalError("Password is required.");
      return;
    }
    if (mode === "signup" && password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "signup") {
        await signup(username, password);
      } else {
        await login(username, password);
      }
    } catch (err) {
      setLocalError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = submitting || isLoading;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "oklch(0.97 0.01 245)" }}
      data-ocid="login-page"
    >
      <div className="w-full max-w-md">
        <Card
          className="overflow-hidden border-0 shadow-2xl"
          style={{ background: "oklch(0.18 0.09 245)" }}
        >
          {/* Top accent bar */}
          <div
            className="h-1.5 w-full"
            style={{ background: "oklch(0.72 0.18 55)" }}
          />

          <div className="p-8">
            {/* School branding */}
            <div className="flex flex-col items-center text-center mb-8">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full border-2 mb-4 overflow-hidden"
                style={{ borderColor: "oklch(0.72 0.18 55)" }}
              >
                <img
                  src="/assets/generated/school-logo-transparent.dim_200x200.png"
                  alt="School Logo"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement
                      ?.querySelector(".fallback-icon")
                      ?.classList.remove("hidden");
                  }}
                />
                <GraduationCap
                  className="fallback-icon hidden h-10 w-10"
                  style={{ color: "oklch(0.72 0.18 55)" }}
                  aria-hidden
                />
              </div>
              <h1
                className="font-display text-2xl font-bold tracking-wide mb-1"
                style={{ color: "oklch(0.97 0.04 55)" }}
              >
                Adarsh Siksha Kendre
              </h1>
              <p className="text-sm" style={{ color: "oklch(0.72 0.18 55)" }}>
                Bajra, Mandar, Ranchi &mdash; Est. 2005
              </p>
            </div>

            {/* Mode title */}
            <h2
              className="text-lg font-semibold text-center mb-6"
              style={{ color: "oklch(0.88 0.04 245)" }}
            >
              {mode === "login" ? "Staff Login" : "Create Admin Account"}
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium"
                  style={{ color: "oklch(0.75 0.04 245)" }}
                >
                  Username
                </Label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                    style={{ color: "oklch(0.55 0.04 245)" }}
                    aria-hidden
                  />
                  <Input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isBusy}
                    className="pl-10"
                    style={{
                      background: "oklch(0.24 0.07 245)",
                      borderColor: "oklch(0.35 0.06 245)",
                      color: "oklch(0.92 0.03 245)",
                    }}
                    data-ocid="login-username"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium"
                  style={{ color: "oklch(0.75 0.04 245)" }}
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                    style={{ color: "oklch(0.55 0.04 245)" }}
                    aria-hidden
                  />
                  <Input
                    id="password"
                    type="password"
                    autoComplete={
                      mode === "signup" ? "new-password" : "current-password"
                    }
                    placeholder={
                      mode === "signup" ? "Min. 6 characters" : "Enter password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isBusy}
                    className="pl-10"
                    style={{
                      background: "oklch(0.24 0.07 245)",
                      borderColor: "oklch(0.35 0.06 245)",
                      color: "oklch(0.92 0.03 245)",
                    }}
                    data-ocid="login-password"
                  />
                </div>
              </div>

              {/* Error */}
              <div
                className="min-h-[2.5rem]"
                role="alert"
                aria-live="polite"
                data-ocid="login-error"
              >
                {error && (
                  <div
                    className="flex items-start gap-2 rounded-lg px-4 py-3 text-sm"
                    style={{
                      background: "oklch(0.25 0.08 20)",
                      color: "oklch(0.88 0.08 25)",
                      border: "1px solid oklch(0.45 0.14 20)",
                    }}
                  >
                    <AlertCircle
                      className="h-4 w-4 mt-0.5 flex-shrink-0"
                      aria-hidden
                    />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isBusy}
                className="w-full py-3 text-base font-semibold transition-smooth disabled:opacity-60"
                style={{
                  background: isBusy
                    ? "oklch(0.52 0.14 55)"
                    : "oklch(0.62 0.18 55)",
                  color: "oklch(0.15 0.05 245)",
                }}
                data-ocid="login-btn"
                aria-busy={isBusy}
              >
                {isBusy ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    {mode === "signup"
                      ? "Creating account..."
                      : "Logging in..."}
                  </span>
                ) : mode === "signup" ? (
                  "Create Admin Account"
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            {/* Toggle mode */}
            <p
              className="mt-5 text-center text-sm"
              style={{ color: "oklch(0.6 0.04 245)" }}
            >
              {mode === "login" ? (
                <>
                  First time?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setLocalError(null);
                    }}
                    className="underline font-medium"
                    style={{ color: "oklch(0.72 0.18 55)" }}
                    data-ocid="toggle-signup"
                  >
                    Create admin account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setLocalError(null);
                    }}
                    className="underline font-medium"
                    style={{ color: "oklch(0.72 0.18 55)" }}
                    data-ocid="toggle-login"
                  >
                    Login instead
                  </button>
                </>
              )}
            </p>

            <p
              className="mt-2 text-center text-xs"
              style={{ color: "oklch(0.48 0.04 245)" }}
            >
              Authorized staff only.
            </p>
          </div>
        </Card>

        <p
          className="mt-6 text-center text-xs"
          style={{ color: "oklch(0.5 0.03 245)" }}
        >
          &copy; {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80 transition-smooth"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
