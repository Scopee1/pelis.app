import { Navigate, Outlet, useLocation } from "react-router";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Forbidden } from "../pages/Forbidden";
import type { UserRole } from "../types/auth";

interface ProtectedRouteProps {
  roles?: UserRole[];
}

export const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
  // isPending: true hasta que responde /api/auth/get-session (por eso F5 no te saca).
  const { user, role, isPending } = useCurrentUser();
  const location = useLocation();

  if (isPending) {
    return <p className="py-20 text-center text-zinc-500">Verificando sesión…</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  if (roles && !roles.includes(role)) {
    return <Forbidden />;
  }

  return <Outlet />;
};
