import { Link } from "react-router";
import { formatDuration, formatRating, formatYear } from "../lib/format";
import type { Movie } from "../types/movie";
import { MoviePoster } from "./MoviePoster";

export const MovieCard = ({ movie }: { movie: Movie }) => (
  <Link
    to={`/movies/${movie._id}`}
    className="group flex flex-col gap-3 rounded-2xl p-2 transition hover:bg-zinc-900 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
  >
    <div className="relative">
      <MoviePoster movie={movie} className="transition group-hover:scale-[1.02]" />
      <span className="absolute top-2 right-2 rounded-md bg-zinc-950/85 px-2 py-0.5 text-sm font-bold text-amber-400">
        ★ {formatRating(movie.rating)}
      </span>
      {movie.isFeatured && (
        <span className="absolute top-2 left-2 rounded-md bg-amber-400 px-2 py-0.5 text-xs font-bold text-zinc-950">
          Destacada
        </span>
      )}
    </div>
    <div className="px-1">
      <h3 className="leading-snug font-semibold text-zinc-100 group-hover:text-amber-300">{movie.title}</h3>
      <p className="text-sm text-zinc-400">
        {formatYear(movie.releaseDate)} · {movie.genre} · {formatDuration(movie.durationMinutes)}
      </p>
    </div>
  </Link>
);
