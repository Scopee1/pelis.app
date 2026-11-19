import { Link, useParams } from "react-router";
import { MoviePoster } from "../components/MoviePoster";
import { Alert } from "../components/ui/Alert";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { formatDate, formatDuration, formatRating } from "../lib/format";
import { useGetMovieByIdQuery } from "../store/moviesApi";

const HTTP_NOT_FOUND = 404;
const HTTP_BAD_REQUEST = 400;

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-0.5">
    <dt className="text-xs tracking-wide text-zinc-500 uppercase">{label}</dt>
    <dd className="font-medium text-zinc-100">{value}</dd>
  </div>
);

export const MovieDetail = () => {
  const { id = "" } = useParams();
  const { data: movie, isLoading, error } = useGetMovieByIdQuery(id);
  const { isAdmin } = useCurrentUser();

  if (isLoading) return <p className="py-20 text-center text-zinc-500">Cargando película…</p>;

  if (error || !movie) {
    const status = error && "status" in error ? error.status : undefined;
    const notFound = status === HTTP_NOT_FOUND || status === HTTP_BAD_REQUEST;
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <Alert>{notFound ? "Esa película no existe o fue eliminada." : (error?.message ?? "Error al cargar")}</Alert>
        <Link to="/" className="btn-secondary">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <article className="flex flex-col gap-8">
      <Link to="/" className="text-sm text-zinc-400 hover:text-white">
        ← Volver al catálogo
      </Link>
      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        <MoviePoster movie={movie} className="mx-auto w-full max-w-[280px]" />
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-zinc-700 px-3 py-0.5 text-xs text-zinc-300">{movie.genre}</span>
              {movie.isFeatured && (
                <span className="rounded-full bg-amber-400 px-3 py-0.5 text-xs font-bold text-zinc-950">Destacada</span>
              )}
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{movie.title}</h1>
            <p className="text-lg text-zinc-400">Dirigida por {movie.director}</p>
          </header>

          <p className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-amber-400">★ {formatRating(movie.rating)}</span>
            <span className="text-zinc-500">/ 10</span>
          </p>

          <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 sm:grid-cols-3">
            <DetailRow label="Estreno" value={formatDate(movie.releaseDate)} />
            <DetailRow label="Duración" value={formatDuration(movie.durationMinutes)} />
            <DetailRow label="Género" value={movie.genre} />
          </dl>

          {movie.synopsis && (
            <section className="flex flex-col gap-2">
              <h2 className="text-sm tracking-wide text-zinc-500 uppercase">Sinopsis</h2>
              <p className="max-w-prose leading-relaxed text-zinc-300">{movie.synopsis}</p>
            </section>
          )}

          {isAdmin && (
            <Link to={`/admin/movies/${movie._id}/edit`} className="btn-secondary self-start">
              Editar película
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};
