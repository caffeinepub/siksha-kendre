import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import StaffManagement from "./components/StaffManagement";
import { useAuth } from "./hooks/useAuth";

// ─── Pages ────────────────────────────────────────────────────────────────────

import AddStudentPage from "./pages/AddStudentPage";
import DashboardPage from "./pages/DashboardPage";
import StudentDetailPage from "./pages/StudentDetailPage";
import StudentsListPage from "./pages/StudentsListPage";

// ─── Route tree ───────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: AppRoot,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: DashboardPage,
});

const studentsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/students",
  component: StudentsListPage,
});

const addStudentRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/students/new",
  component: AddStudentPage,
});

const studentDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/students/$studentId",
  component: StudentDetailPage,
});

const staffRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/staff",
  component: StaffManagement,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    indexRoute,
    studentsRoute,
    addStudentRoute,
    studentDetailRoute,
    staffRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─── Root component (auth gate) ───────────────────────────────────────────────

function AppRoot() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.97 0.01 245)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-10 w-10 rounded-full border-4 animate-spin"
            style={{
              borderColor: "oklch(0.72 0.18 55)",
              borderTopColor: "transparent",
            }}
          />
          <p className="text-sm" style={{ color: "oklch(0.55 0.04 245)" }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <RouterProvider router={router} />
    </>
  );
}

export default function App() {
  return <AppRoot />;
}
