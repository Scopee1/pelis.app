import { z } from "zod";
import { MOVIE_GENRES, MOVIE_LIMITS } from "../constants/movie";
import { toDateInputValue } from "../lib/format";
import type { Movie } from "../types/movie";

export const movieSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: "El título es obligatorio" })
    .max(MOVIE_LIMITS.titleMaxLength, { error: `Máximo ${MOVIE_LIMITS.titleMaxLength} caracteres` }),
  director: z
    .string()
    .trim()
    .min(1, { error: "El director es obligatorio" })
    .max(MOVIE_LIMITS.directorMaxLength, { error: `Máximo ${MOVIE_LIMITS.directorMaxLength} caracteres` }),
  genre: z.enum(MOVIE_GENRES, { error: "Elegí un género" }),
  releaseDate: z.iso.date({ error: "Ingresá una fecha de estreno válida" }),
  durationMinutes: z
    .number({ error: "Ingresá la duración en minutos" })
    .int({ error: "La duración tiene que ser un número entero" })
    .min(MOVIE_LIMITS.minDurationMinutes, { error: "La duración mínima es 1 minuto" })
    .max(MOVIE_LIMITS.maxDurationMinutes, { error: `La duración máxima es ${MOVIE_LIMITS.maxDurationMinutes} minutos` }),
  rating: z
    .number({ error: "Ingresá una puntuación" })
    .min(MOVIE_LIMITS.minRating, { error: `La puntuación mínima es ${MOVIE_LIMITS.minRating}` })
    .max(MOVIE_LIMITS.maxRating, { error: `La puntuación máxima es ${MOVIE_LIMITS.maxRating}` }),
  isFeatured: z.boolean(),
  synopsis: z
    .string()
    .trim()
    .max(MOVIE_LIMITS.synopsisMaxLength, { error: `Máximo ${MOVIE_LIMITS.synopsisMaxLength} caracteres` }),
  posterUrl: z.union([z.url({ error: "La URL del poster no es válida" }), z.literal("")]),
});

export type MovieFormValues = z.infer<typeof movieSchema>;

export const emptyMovieForm: Partial<MovieFormValues> = {
  title: "",
  director: "",
  releaseDate: "",
  isFeatured: false,
  synopsis: "",
  posterUrl: "",
};

export function toMovieFormValues(movie: Movie): MovieFormValues {
  return {
    title: movie.title,
    director: movie.director,
    genre: movie.genre,
    releaseDate: toDateInputValue(movie.releaseDate),
    durationMinutes: movie.durationMinutes,
    rating: movie.rating,
    isFeatured: movie.isFeatured,
    synopsis: movie.synopsis ?? "",
    posterUrl: movie.posterUrl ?? "",
  };
}
