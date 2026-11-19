import { useState } from "react";
import { GENRE_GRADIENTS } from "../constants/movie";
import type { Movie } from "../types/movie";

interface MoviePosterProps {
  movie: Pick<Movie, "title" | "genre" | "posterUrl">;
  className?: string;
}

export const MoviePoster = ({ movie, className = "" }: MoviePosterProps) => {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(movie.posterUrl) && !failed;

  return (
    <div className={`relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 ${className}`}>
      {showImage ? (
        <img
          src={movie.posterUrl}
          alt={`Poster de ${movie.title}`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className={`flex h-full w-full flex-col justify-end bg-gradient-to-br p-4 ${GENRE_GRADIENTS[movie.genre]}`}
          aria-hidden="true"
        >
          <span className="font-display text-xl leading-tight font-bold text-white/90 drop-shadow">
            {movie.title}
          </span>
        </div>
      )}
    </div>
  );
};
