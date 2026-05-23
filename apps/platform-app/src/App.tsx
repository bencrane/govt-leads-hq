/**
 * App — the platform-app router shell.
 *
 * Routes:
 *   `/`                          → redirect to /winners.
 *   `/winners`                   → 30-day federal contract winners browser.
 *   `/opportunities`             → SAM.gov active opportunities list (auth).
 *   `/opportunities/:notice_id`  → single opportunity detail (auth).
 *
 * The /opportunities surface is gated by <RequireAuth>. /winners is public.
 * Both branches live under one <AuthProvider> at the App root.
 */

import { Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider, useAuth } from "./lib/auth";
import { SignIn } from "./opportunities/SignIn";
import OppsList from "./opportunities/OppsList";
import OppDetail from "./opportunities/OppDetail";
import { Winners } from "./winners/Winners";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (!session) return <SignIn />;
  return <>{children}</>;
}

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/winners" replace />} />
        <Route path="/winners" element={<Winners />} />
        <Route
          path="/opportunities"
          element={
            <RequireAuth>
              <OppsList />
            </RequireAuth>
          }
        />
        <Route
          path="/opportunities/:notice_id"
          element={
            <RequireAuth>
              <OppDetail />
            </RequireAuth>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
