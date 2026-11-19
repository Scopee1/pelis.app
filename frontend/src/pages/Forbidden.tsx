import { Link } from "react-router";

export const Forbidden = () => (
  <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
    <p className="font-display text-6xl font-bold text-amber-400">403</p>
    <h1 className="text-2xl font-semibold">Sin permisos</h1>
    <p className="text-zinc-400">Esta sección es solo para administradores. Tu usuario puede ver el catálogo pero no editarlo.</p>
    <Link to="/" className="btn-secondary">
      Volver al catálogo
    </Link>
  </div>
);
