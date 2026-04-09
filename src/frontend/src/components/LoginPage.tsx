import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  BookOpen,
  GraduationCap,
  Loader2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const features = [
  { icon: Users, text: "Manage student admissions" },
  { icon: BookOpen, text: "Track monthly class fees" },
  { icon: ShieldCheck, text: "Secure staff-only access" },
];

export default function LoginPage() {
  const { login, isLoading, loginError, loginStatus } = useAuth();

  // Disabled when local flag OR the underlying hook says it's actively logging in.
  const isLoggingIn = isLoading || loginStatus === "logging-in";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "oklch(0.97 0.01 245)" }}
      data-ocid="login-page"
    >
      <div className="w-full max-w-md">
        {/* School branding card */}
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
            {/* Logo + name */}
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

            {/* Features list */}
            <div className="mb-8 space-y-3">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon
                    className="h-4 w-4 flex-shrink-0"
                    style={{ color: "oklch(0.72 0.18 55)" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "oklch(0.82 0.03 245)" }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Error message — min-h reserves layout space to prevent button jump */}
            <div
              className="mb-4 min-h-[2.5rem]"
              role="alert"
              aria-live="polite"
              data-ocid="login-error"
            >
              {loginError && (
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
                  <span>{loginError}</span>
                </div>
              )}
            </div>

            {/* Login button */}
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full py-3 text-base font-semibold transition-smooth disabled:opacity-60"
              style={{
                background: isLoggingIn
                  ? "oklch(0.52 0.14 55)"
                  : "oklch(0.62 0.18 55)",
                color: "oklch(0.15 0.05 245)",
              }}
              data-ocid="login-btn"
              aria-busy={isLoggingIn}
            >
              {isLoggingIn ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Logging in...
                </span>
              ) : (
                "Login with Internet Identity"
              )}
            </Button>

            <p
              className="mt-4 text-center text-xs"
              style={{ color: "oklch(0.55 0.04 245)" }}
            >
              Authorized staff only. Powered by Internet Identity.
            </p>
            <p
              className="mt-2 text-center text-xs"
              style={{ color: "oklch(0.48 0.04 245)" }}
            >
              Make sure pop-ups are allowed in your browser for this site.
            </p>
          </div>
        </Card>

        {/* Footer */}
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
