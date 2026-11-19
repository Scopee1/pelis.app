import { useCallback, useState } from "react";
import { Link } from "react-router";
import { AdminTabs } from "../../components/admin/AdminTabs";
import { SearchInput } from "../../components/SearchInput";
import { Alert } from "../../components/ui/Alert";
import { Pagination } from "../../components/ui/Pagination";
import { ADMIN_PAGE_SIZE } from "../../constants/movie";
import { formatDate, formatRating } from "../../lib/format";
import { useDeleteMovieMutation, useGetMoviesQuery } from "../../store/moviesApi";
import type { Movie } from "../../types/movie";

export const AdminMovies = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const { data, isLoading, error } = useGetMoviesQuery({
    page,
    limit: ADMIN_PAGE_SIZE,
    search: search || undefined,
    sortBy: "title",
    sortOrder: "asc",
  });
  const [deleteMovie, { isLoading: isDeleting }] = useDeleteMovieMutation();

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleDelete = async (movie: Movie) => {
    if (!window.confirm(`¿Eliminar "${movie.title}"? Esta acción no se puede deshacer.`)) return;
    const result = await deleteMovie(movie._id);
    setNotice(
      "error" in result
        ? { tone: "error", text: result.error && "message" in result.error ? String(result.error.message) : "No se pudo eliminar" }
        : { tone: "success", text: `"${movie.title}" fue eliminada.` },
    );
  };

  const movies = data?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Panel de administración</h1>
          <p className="text-zinc-400">Alta, baja y modificación del catálogo.</p>
        </div>
        <Link to="/admin/movies/new" className="btn-primary">
          + Nueva película
        </Link>
      </header>

      <AdminTabs />

      <div className="max-w-sm">
        <SearchInput value={search} onSearch={handleSearch} placeholder="Buscar título o director" />
      </div>

      {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}
      {error && <Alert>{error.message}</Alert>}

      <div className="overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-zinc-900 text-xs tracking-wide text-zinc-400 uppercase">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Género</th>
              <th className="px-4 py-3">Estreno</th>
              <th className="px-4 py-3">Puntuación</th>
              <th className="px-4 py-3">Destacada</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  Cargando…
                </td>
              </tr>
            )}
            {!isLoading && movies.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  No hay películas.
                </td>
              </tr>
            )}
            {movies.map((movie) => (
              <tr key={movie._id} className="hover:bg-zinc-900/60">
                <td className="px-4 py-3 font-medium">
                  <Link to={`/movies/${movie._id}`} className="hover:text-amber-300">
                    {movie.title}
                  </Link>
                  <p className="text-xs text-zinc-500">{movie.director}</p>
                </td>
                <td className="px-4 py-3 text-zinc-300">{movie.genre}</td>
                <td className="px-4 py-3 text-zinc-300">{formatDate(movie.releaseDate)}</td>
                <td className="px-4 py-3 font-semibold text-amber-400">★ {formatRating(movie.rating)}</td>
                <td className="px-4 py-3 text-zinc-300">{movie.isFeatured ? "Sí" : "No"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link to={`/admin/movies/${movie._id}/edit`} className="btn-secondary px-3 py-1.5">
                      Editar
                    </Link>
                    <button
                      type="button"
                      className="btn-danger px-3 py-1.5"
                      disabled={isDeleting}
                      onClick={() => handleDelete(movie)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={data?.meta.totalPages ?? 0} onPageChange={setPage} />
    </div>
  );
};
