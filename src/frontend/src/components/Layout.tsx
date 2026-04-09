import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, ShieldCheck, UserPlus, Users } from "lucide-react";
import { UserRole } from "../backend.d";
import { useAuth } from "../hooks/useAuth";
import Header from "./Header";

function NavItem({
  to,
  icon: Icon,
  label,
}: { to: string; icon: React.ElementType; label: string }) {
  const { location } = useRouterState();
  const isActive =
    to === "/" ? location.pathname === "/" : location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-smooth ${
        isActive
          ? "border-[oklch(0.72_0.18_55)] text-[oklch(0.97_0.04_55)]"
          : "border-transparent text-[oklch(0.65_0.04_245)] hover:text-[oklch(0.85_0.04_55)] hover:border-[oklch(0.55_0.12_55)]"
      }`}
      data-ocid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {label}
    </Link>
  );
}

export default function Layout() {
  const { role } = useAuth();
  const isAdmin = role === UserRole.admin;

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/students", icon: Users, label: "Students" },
    { to: "/students/new", icon: UserPlus, label: "Add Student" },
    ...(isAdmin ? [{ to: "/staff", icon: ShieldCheck, label: "Staff" }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Sub-navigation */}
      <nav
        className="border-b"
        style={{
          background: "oklch(0.21 0.08 245)",
          borderColor: "oklch(0.28 0.06 245)",
        }}
        data-ocid="sub-nav"
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t py-4 text-center text-xs"
        style={{
          background: "oklch(0.21 0.08 245)",
          borderColor: "oklch(0.28 0.06 245)",
          color: "oklch(0.5 0.03 245)",
        }}
      >
        &copy; {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80 transition-smooth"
          style={{ color: "oklch(0.65 0.15 55)" }}
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
