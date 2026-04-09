import { Button } from "@/components/ui/button";
import { GraduationCap, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const { isAuthenticated, logout, isLoading } = useAuth();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[oklch(0.28_0.06_245)] shadow-md"
      style={{ background: "oklch(0.18 0.09 245)" }}
      data-ocid="header"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Branding */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 overflow-hidden"
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
              className="fallback-icon hidden text-[oklch(0.72_0.18_55)] h-6 w-6"
              aria-hidden
            />
          </div>
          <div className="min-w-0">
            <h1
              className="font-display text-base font-bold leading-tight tracking-wide truncate"
              style={{ color: "oklch(0.97 0.04 55)" }}
            >
              Adarsh Siksha Kendre
            </h1>
            <p
              className="text-xs leading-tight truncate"
              style={{ color: "oklch(0.72 0.18 55)" }}
            >
              Bajra, Mandar, Ranchi &mdash; Est. 2005
            </p>
          </div>
        </div>

        {/* Actions */}
        {isAuthenticated && (
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            disabled={isLoading}
            className="flex items-center gap-2 text-sm font-medium transition-smooth"
            style={{ color: "oklch(0.85 0.05 55)" }}
            data-ocid="logout-btn"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        )}
      </div>
    </header>
  );
}
