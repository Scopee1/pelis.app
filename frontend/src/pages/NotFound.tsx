import { Link } from "react-router";

export const NotFound = () => (
  <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
    <p className="font-display text-6xl font-bold text-amber-400">404</p>
    <h1 className="text-2xl font-semibold">Página no encontrada</h1>
    <p className="text-zinc-400">La dirección que buscás no existe.</p>
    <Link to="/" className="btn-secondary">
      Volver al catálogo
    </Link>
  </div>
);
