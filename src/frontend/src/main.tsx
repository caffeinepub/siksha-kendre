import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import type { AuthClientCreateOptions } from "@dfinity/auth-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

// Read env.json at runtime — values are injected by the Caffeine platform at
// deployment time. At build time they are all the literal string "undefined".
async function getCreateOptions(): Promise<
  AuthClientCreateOptions | undefined
> {
  try {
    const resp = await fetch("/env.json");
    if (!resp.ok) return undefined;
    const env = (await resp.json()) as Record<string, string>;
    const derivationOrigin = env.ii_derivation_origin;
    // Treat the literal string "undefined", empty string, and missing as absent.
    if (!derivationOrigin || derivationOrigin === "undefined") return undefined;
    return {
      loginOptions: { derivationOrigin },
    };
  } catch {
    return undefined;
  }
}

async function bootstrap() {
  const createOptions = await getCreateOptions();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider createOptions={createOptions}>
        <App />
      </InternetIdentityProvider>
    </QueryClientProvider>,
  );
}

bootstrap().catch((err) => {
  console.error("Bootstrap error:", err);
  // Fallback: render without derivationOrigin so the app still loads.
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <App />
      </InternetIdentityProvider>
    </QueryClientProvider>,
  );
});
