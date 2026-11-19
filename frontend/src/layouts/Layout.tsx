import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { signOut } from "../lib/auth-client";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { ROLE_LABELS } from "../types/auth";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition ${
    isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
  }`;

const UserMenu = () => {
  const { user, role, isPending } = useCurrentUser();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
    navigate("/");
  };

  if (isPending) return <span className="h-8 w-24 animate-pulse rounded-md bg-zinc-800" />;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login" className="btn-secondary">
          Ingresar
        </Link>
        <Link to="/register" className="btn-primary hidden sm:inline-flex">
          Crear cuenta
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm leading-tight font-medium">{user.name}</p>
        <p className="text-xs text-zinc-500">{ROLE_LABELS[role]}</p>
      </div>
      <button type="button" className="btn-secondary" onClick={handleSignOut} disabled={signingOut}>
        {signingOut ? "Saliendo…" : "Salir"}
      </button>
    </div>
  );
};

export const Layout = () => {
  const { isAdmin } = useCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-display text-xl font-bold tracking-tight">
              pelis<span className="text-amber-400">.app</span>
            </Link>
            <nav className="flex items-center gap-1">
              <NavLink to="/" end className={navLinkClass}>
                Catálogo
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={navLinkClass}>
                  Admin
                </NavLink>
              )}
            </nav>
          </div>
          <UserMenu />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">
        pelis.app · Trabajo práctico de Programación Web Full Stack
      </footer>
    </div>
  );
};
